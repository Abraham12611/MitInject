"""Web3 Analysis toolkit for NordStar.

This toolkit provides tools for analyzing Web3 trends, on-chain metrics,
and monitoring DeFi activities across various blockchains.
"""

import json
import os
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
import time

import pandas as pd
import numpy as np
import requests
from web3 import Web3

from camel.toolkits import FunctionTool, ToolSpecification, BaseTool
from camel.types import get_tool_schema

logger = logging.getLogger(__name__)


class Web3AnalysisToolkit(BaseTool):
    """Toolkit for analyzing Web3 trends and blockchain metrics."""

    def __init__(
        self,
        etherscan_api_key: Optional[str] = None,
        defillama_api_url: str = "https://api.llama.fi",
        coinmarketcap_api_key: Optional[str] = None,
        eth_rpc_url: Optional[str] = None,
    ):
        """Initialize the Web3AnalysisToolkit.

        Args:
            etherscan_api_key: API key for Etherscan
            defillama_api_url: URL for DeFiLlama API
            coinmarketcap_api_key: API key for CoinMarketCap
            eth_rpc_url: Ethereum RPC URL for direct blockchain access
        """
        super().__init__()
        self.etherscan_api_key = etherscan_api_key or os.environ.get("ETHERSCAN_API_KEY")
        self.defillama_api_url = defillama_api_url
        self.coinmarketcap_api_key = coinmarketcap_api_key or os.environ.get("CMC_API_KEY")
        self.eth_rpc_url = eth_rpc_url or os.environ.get("ETH_RPC_URL", "https://mainnet.infura.io/v3/")

        # Map of chain names to their IDs in various services
        self.chain_map = {
            "ethereum": {
                "defillama": "ethereum",
                "coin_id": 1,
                "name": "Ethereum",
            },
            "injective": {
                "defillama": "injective",
                "coin_id": 10260,
                "name": "Injective",
            },
            "solana": {
                "defillama": "solana",
                "coin_id": 5426,
                "name": "Solana",
            },
            "arbitrum": {
                "defillama": "arbitrum",
                "coin_id": 42161,
                "name": "Arbitrum",
            },
            "optimism": {
                "defillama": "optimism",
                "coin_id": 10,
                "name": "Optimism",
            },
            "polygon": {
                "defillama": "polygon",
                "coin_id": 137,
                "name": "Polygon",
            },
            "base": {
                "defillama": "base",
                "coin_id": 8453,
                "name": "Base",
            },
        }

    @get_tool_schema
    def analyze_chain_metrics(
        self,
        chain_id: str
    ) -> Dict[str, Any]:
        """Analyze on-chain metrics for specified blockchain.

        Args:
            chain_id: Blockchain identifier (e.g., 'ethereum', 'injective', 'solana')

        Returns:
            Dictionary with on-chain metrics including TVL, active addresses, etc.
        """
        try:
            if chain_id not in self.chain_map:
                return {
                    "error": f"Chain '{chain_id}' not supported. Supported chains: {', '.join(self.chain_map.keys())}"
                }

            chain_info = self.chain_map[chain_id]

            # Get TVL data from DeFiLlama
            tvl_response = requests.get(
                f"{self.defillama_api_url}/v2/chains/{chain_info['defillama']}"
            )
            tvl_data = tvl_response.json()

            # Get protocols on this chain
            protocols_response = requests.get(
                f"{self.defillama_api_url}/protocols"
            )
            all_protocols = protocols_response.json()
            chain_protocols = [
                protocol for protocol in all_protocols
                if chain_info["defillama"] in protocol.get("chains", [])
            ]

            # Get gas prices for Ethereum and EVM chains
            gas_data = {}
            if chain_id in ["ethereum", "arbitrum", "optimism", "polygon", "base"]:
                gas_response = requests.get(
                    f"https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey={self.etherscan_api_key}"
                )
                if gas_response.status_code == 200:
                    gas_data = gas_response.json().get("result", {})

            # Compile metrics
            metrics = {
                "chain_id": chain_id,
                "name": chain_info["name"],
                "tvl_usd": tvl_data.get("tvl", 0),
                "tvl_change_24h": tvl_data.get("change_1d", 0),
                "tvl_change_7d": tvl_data.get("change_7d", 0),
                "protocols_count": len(chain_protocols),
                "top_protocols": [
                    {
                        "name": protocol.get("name"),
                        "tvl": protocol.get("tvl", 0),
                        "category": protocol.get("category", "Unknown")
                    }
                    for protocol in sorted(chain_protocols, key=lambda x: x.get("tvl", 0), reverse=True)[:5]
                ],
                "gas_prices": gas_data if gas_data else "Not applicable",
                "timestamp": datetime.now().isoformat()
            }

            return metrics
        except Exception as e:
            logger.error(f"Error analyzing chain metrics: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def track_defi_trends(
        self,
        days_back: int = 30
    ) -> Dict[str, Any]:
        """Track current DeFi trends across protocols.

        Args:
            days_back: Number of days to look back for trend analysis

        Returns:
            Analysis of DeFi trends including top growing protocols and categories
        """
        try:
            # Get protocol data from DeFiLlama
            protocols_response = requests.get(
                f"{self.defillama_api_url}/protocols"
            )
            protocols = protocols_response.json()

            # Analyze protocol growth by categories
            categories = {}
            for protocol in protocols:
                category = protocol.get("category", "Other")
                if category not in categories:
                    categories[category] = {
                        "count": 0,
                        "total_tvl": 0,
                        "change_7d": 0,
                        "protocols": []
                    }

                categories[category]["count"] += 1
                categories[category]["total_tvl"] += protocol.get("tvl", 0)
                categories[category]["change_7d"] += protocol.get("change_7d", 0) * protocol.get("tvl", 0)
                categories[category]["protocols"].append({
                    "name": protocol.get("name"),
                    "tvl": protocol.get("tvl", 0),
                    "change_7d": protocol.get("change_7d", 0)
                })

            # Calculate average change for each category
            for category in categories:
                if categories[category]["total_tvl"] > 0:
                    categories[category]["change_7d"] = categories[category]["change_7d"] / categories[category]["total_tvl"]
                categories[category]["protocols"] = sorted(
                    categories[category]["protocols"],
                    key=lambda x: x.get("tvl", 0),
                    reverse=True
                )[:5]  # Top 5 protocols by TVL in each category

            # Sort categories by growth
            top_growing_categories = sorted(
                [(k, v) for k, v in categories.items()],
                key=lambda x: x[1]["change_7d"],
                reverse=True
            )

            # Find top growing protocols
            top_protocols = sorted(
                [p for p in protocols if p.get("tvl", 0) > 1000000],  # Only include protocols with >$1M TVL
                key=lambda x: x.get("change_7d", 0),
                reverse=True
            )[:10]

            # Calculate chain dominance
            chain_tvl = {}
            for protocol in protocols:
                for chain in protocol.get("chains", []):
                    if chain not in chain_tvl:
                        chain_tvl[chain] = 0
                    chain_tvl[chain] += protocol.get("tvl", 0) / len(protocol.get("chains", [1]))

            total_tvl = sum(chain_tvl.values())
            chain_dominance = {
                chain: {
                    "tvl": tvl,
                    "percentage": (tvl / total_tvl * 100) if total_tvl > 0 else 0
                }
                for chain, tvl in chain_tvl.items()
            }

            top_chains = sorted(
                [(k, v) for k, v in chain_dominance.items()],
                key=lambda x: x[1]["tvl"],
                reverse=True
            )[:10]

            return {
                "top_growing_categories": [
                    {
                        "category": category,
                        "count": data["count"],
                        "total_tvl": data["total_tvl"],
                        "change_7d": data["change_7d"],
                        "top_protocols": data["protocols"][:3]  # Top 3 for brevity
                    }
                    for category, data in top_growing_categories[:5]  # Top 5 categories
                ],
                "top_growing_protocols": [
                    {
                        "name": protocol.get("name"),
                        "category": protocol.get("category", "Unknown"),
                        "tvl": protocol.get("tvl", 0),
                        "change_7d": protocol.get("change_7d", 0),
                        "chains": protocol.get("chains", [])
                    }
                    for protocol in top_protocols
                ],
                "chain_dominance": [
                    {
                        "chain": chain,
                        "tvl": data["tvl"],
                        "percentage": data["percentage"]
                    }
                    for chain, data in top_chains
                ],
                "total_defi_tvl": total_tvl,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error tracking DeFi trends: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def monitor_token_metrics(
        self,
        token_symbol: str
    ) -> Dict[str, Any]:
        """Monitor metrics for a specific token.

        Args:
            token_symbol: Symbol of token to monitor (e.g., 'ETH', 'INJ', 'SOL')

        Returns:
            Dictionary with token metrics including price, volume, market cap
        """
        try:
            # Use CoinMarketCap API to get token data
            headers = {
                "X-CMC_PRO_API_KEY": self.coinmarketcap_api_key,
                "Accept": "application/json"
            }

            # Get token ID first
            listings_response = requests.get(
                "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
                headers=headers,
                params={
                    "limit": 5000,
                    "convert": "USD"
                }
            )

            listings_data = listings_response.json()
            token_data = None

            for token in listings_data.get("data", []):
                if token.get("symbol") == token_symbol.upper():
                    token_data = token
                    break

            if not token_data:
                return {"error": f"Token {token_symbol} not found"}

            # Get more detailed quotes
            quote_response = requests.get(
                f"https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest",
                headers=headers,
                params={
                    "id": token_data["id"],
                    "convert": "USD"
                }
            )

            detailed_data = quote_response.json()
            token_details = detailed_data["data"][str(token_data["id"])]
            quote = token_details["quote"]["USD"]

            # Format response
            metrics = {
                "name": token_details["name"],
                "symbol": token_details["symbol"],
                "price_usd": quote["price"],
                "market_cap": quote["market_cap"],
                "volume_24h": quote["volume_24h"],
                "change_1h": quote["percent_change_1h"],
                "change_24h": quote["percent_change_24h"],
                "change_7d": quote["percent_change_7d"],
                "change_30d": quote["percent_change_30d"],
                "circulating_supply": token_details["circulating_supply"],
                "total_supply": token_details["total_supply"],
                "max_supply": token_details["max_supply"],
                "cmc_rank": token_details["cmc_rank"],
                "last_updated": quote["last_updated"],
                "timestamp": datetime.now().isoformat()
            }

            return metrics
        except Exception as e:
            logger.error(f"Error monitoring token metrics: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def analyze_dex_volume(
        self,
        dex_name: Optional[str] = None,
        chain_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Track volume on decentralized exchanges.

        Args:
            dex_name: Name of DEX to analyze (optional, if None will return top DEXes)
            chain_id: Chain to filter by (optional)

        Returns:
            Analysis of DEX volume trends
        """
        try:
            # Get DEX data from DeFiLlama
            dexes_response = requests.get(
                f"{self.defillama_api_url}/dexs/summary?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume"
            )
            dexes_data = dexes_response.json()

            # Filter by chain if specified
            if chain_id:
                if chain_id not in self.chain_map:
                    return {
                        "error": f"Chain '{chain_id}' not supported. Supported chains: {', '.join(self.chain_map.keys())}"
                    }

                chain_name = self.chain_map[chain_id]["defillama"]
                dexes_data = [dex for dex in dexes_data if chain_name in dex.get("chains", [])]

            # Filter by DEX name if specified
            if dex_name:
                dex_data = [dex for dex in dexes_data if dex.get("name", "").lower() == dex_name.lower()]
                if not dex_data:
                    return {"error": f"DEX '{dex_name}' not found or not tracked by DeFiLlama"}

                dex_info = dex_data[0]

                # Get detailed breakdown
                breakdown_response = requests.get(
                    f"{self.defillama_api_url}/dexs/chart/{dex_info['name']}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=false&dataType=dailyVolume"
                )
                breakdown_data = breakdown_response.json()

                # Calculate recent trends
                volumes = breakdown_data.get("totalDataChart", [])
                recent_volumes = volumes[-30:] if len(volumes) > 30 else volumes

                # Calculate volume averages
                if recent_volumes:
                    avg_7d = sum([v[1] for v in recent_volumes[-7:]]) / 7 if len(recent_volumes) >= 7 else 0
                    avg_30d = sum([v[1] for v in recent_volumes]) / len(recent_volumes)
                    change_percent = ((avg_7d / avg_30d) - 1) * 100 if avg_30d > 0 else 0
                else:
                    avg_7d = avg_30d = change_percent = 0

                return {
                    "name": dex_info["name"],
                    "chains": dex_info.get("chains", []),
                    "volume_24h": dex_info.get("totalVolume24h", 0),
                    "volume_7d": dex_info.get("totalVolume7d", 0),
                    "avg_volume_7d": avg_7d,
                    "avg_volume_30d": avg_30d,
                    "volume_trend": f"{change_percent:.2f}%" if change_percent else "N/A",
                    "dex_type": dex_info.get("type", "Unknown"),
                    "timestamp": datetime.now().isoformat()
                }
            else:
                # Return top DEXes by volume
                top_dexes = sorted(dexes_data, key=lambda x: x.get("totalVolume24h", 0), reverse=True)[:10]

                return {
                    "top_dexes": [
                        {
                            "name": dex.get("name"),
                            "chains": dex.get("chains", []),
                            "volume_24h": dex.get("totalVolume24h", 0),
                            "volume_7d": dex.get("totalVolume7d", 0),
                            "change_7d": dex.get("change_7d", 0),
                            "dex_type": dex.get("type", "Unknown")
                        }
                        for dex in top_dexes
                    ],
                    "chain_filter": chain_id,
                    "timestamp": datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Error analyzing DEX volume: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def track_nft_trends(
        self
    ) -> Dict[str, Any]:
        """Track NFT marketplace trends.

        Returns:
            Analysis of NFT marketplace volume and trending collections
        """
        try:
            # Fetch NFT marketplace data from DeFiLlama
            nft_response = requests.get(
                f"{self.defillama_api_url}/nfts/collections"
            )
            nft_data = nft_response.json()

            # Sort collections by trading volume
            top_collections = sorted(
                nft_data,
                key=lambda x: x.get("dailyVolumeUSD", 0),
                reverse=True
            )[:20]

            # Get marketplace data
            marketplaces_response = requests.get(
                f"{self.defillama_api_url}/nfts/marketplaces"
            )
            marketplace_data = marketplaces_response.json()

            # Organize data by chain
            chain_volumes = {}
            for collection in nft_data:
                chain = collection.get("chain", "Unknown")
                if chain not in chain_volumes:
                    chain_volumes[chain] = {
                        "daily_volume": 0,
                        "collections": 0
                    }

                chain_volumes[chain]["daily_volume"] += collection.get("dailyVolumeUSD", 0)
                chain_volumes[chain]["collections"] += 1

            top_chains = sorted(
                [(k, v) for k, v in chain_volumes.items()],
                key=lambda x: x[1]["daily_volume"],
                reverse=True
            )

            return {
                "top_collections": [
                    {
                        "name": collection.get("name"),
                        "chain": collection.get("chain"),
                        "floor_price_usd": collection.get("floorPriceUSD"),
                        "daily_volume_usd": collection.get("dailyVolumeUSD"),
                        "daily_change": collection.get("dailyChange"),
                        "weekly_change": collection.get("weeklyChange")
                    }
                    for collection in top_collections
                ],
                "top_marketplaces": [
                    {
                        "name": marketplace.get("name"),
                        "chains": marketplace.get("chains", []),
                        "daily_volume_usd": marketplace.get("dailyVolumeUSD"),
                        "weekly_volume_usd": marketplace.get("weeklyVolumeUSD"),
                        "market_share": marketplace.get("marketShare", 0) * 100
                    }
                    for marketplace in sorted(
                        marketplace_data,
                        key=lambda x: x.get("dailyVolumeUSD", 0),
                        reverse=True
                    )[:10]
                ],
                "volume_by_chain": [
                    {
                        "chain": chain,
                        "daily_volume_usd": data["daily_volume"],
                        "collections_count": data["collections"]
                    }
                    for chain, data in top_chains
                ],
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error tracking NFT trends: {e}")
            return {"error": str(e)}

    def get_tools(self) -> List[FunctionTool]:
        """Get all available tools in this toolkit."""
        return [
            FunctionTool(self.analyze_chain_metrics),
            FunctionTool(self.track_defi_trends),
            FunctionTool(self.monitor_token_metrics),
            FunctionTool(self.analyze_dex_volume),
            FunctionTool(self.track_nft_trends),
        ]