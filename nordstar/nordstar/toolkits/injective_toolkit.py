"""Injective Protocol toolkit for NordStar.

This toolkit provides specialized tools for interacting with Injective Protocol,
a high-performance blockchain designed for decentralized finance (DeFi) applications.
"""

import json
from typing import Dict, List, Optional, Any, Tuple
import os
import logging
from datetime import datetime, timedelta

import pandas as pd
import numpy as np
import ccxt
from pyinjective.async_client import AsyncClient
from pyinjective.constant import Network

from camel.toolkits import FunctionTool, ToolSpecification, BaseTool
from camel.types import get_tool_schema

logger = logging.getLogger(__name__)


class InjectiveToolkit(BaseTool):
    """Toolkit for interacting with Injective Protocol markets."""

    def __init__(
        self,
        network: str = "mainnet",
        api_key: Optional[str] = None,
        timeout: int = 30,
    ):
        """Initialize the InjectiveToolkit.

        Args:
            network: Which Injective network to connect to ('mainnet', 'testnet')
            api_key: Optional API key for rate limit increases
            timeout: Timeout for API requests in seconds
        """
        super().__init__()
        self.network = Network.mainnet() if network == "mainnet" else Network.testnet()
        self.api_key = api_key or os.environ.get("INJECTIVE_API_KEY")
        self.timeout = timeout
        self._client = None

    async def _get_client(self) -> AsyncClient:
        """Get or create an AsyncClient instance."""
        if self._client is None:
            self._client = AsyncClient(
                network=self.network,
                insecure=False,
                timeout=self.timeout,
            )
        return self._client

    @get_tool_schema
    def get_market_data(
        self,
        market_id: str
    ) -> Dict[str, Any]:
        """Fetch current market data for a specific Injective market.

        Args:
            market_id: The Injective market ID to query

        Returns:
            A dictionary containing market data including price, volume, and other stats
        """
        try:
            client = self._get_client()

            # Get market data
            market_response = client.get_spot_market(market_id=market_id)

            # Get order book data
            orderbook_response = client.get_spot_orderbook(market_id=market_id)

            # Format and return data
            market_data = {
                "market_id": market_id,
                "base_token": market_response.market.base_token.symbol,
                "quote_token": market_response.market.quote_token.symbol,
                "price": market_response.market.mark_price,
                "price_24h_change": market_response.market.price_24h_change,
                "volume_24h": market_response.market.volume_24h,
                "best_bid": orderbook_response.orderbook.buys[0].price if orderbook_response.orderbook.buys else None,
                "best_ask": orderbook_response.orderbook.sells[0].price if orderbook_response.orderbook.sells else None,
                "spread": (float(orderbook_response.orderbook.sells[0].price) -
                           float(orderbook_response.orderbook.buys[0].price))
                           if (orderbook_response.orderbook.sells and orderbook_response.orderbook.buys) else None,
                "timestamp": datetime.now().isoformat(),
            }

            return market_data
        except Exception as e:
            logger.error(f"Error fetching Injective market data: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def analyze_order_book(
        self,
        market_id: str,
        depth: int = 10
    ) -> Dict[str, Any]:
        """Analyze order book depth and liquidity for a specific market.

        Args:
            market_id: The Injective market ID to analyze
            depth: Number of order book levels to analyze

        Returns:
            Analysis of order book including liquidity metrics
        """
        try:
            client = self._get_client()

            # Get order book data
            response = client.get_spot_orderbook(market_id=market_id)

            # Process bids and asks
            bids = [{"price": float(order.price), "quantity": float(order.quantity)}
                   for order in response.orderbook.buys[:depth]]
            asks = [{"price": float(order.price), "quantity": float(order.quantity)}
                   for order in response.orderbook.sells[:depth]]

            # Calculate metrics
            bid_liquidity = sum(bid["price"] * bid["quantity"] for bid in bids)
            ask_liquidity = sum(ask["price"] * ask["quantity"] for ask in asks)
            midpoint = (bids[0]["price"] + asks[0]["price"]) / 2 if bids and asks else None

            return {
                "market_id": market_id,
                "bids": bids,
                "asks": asks,
                "bid_liquidity_usd": bid_liquidity,
                "ask_liquidity_usd": ask_liquidity,
                "total_liquidity_usd": bid_liquidity + ask_liquidity,
                "midpoint_price": midpoint,
                "spread_percentage": ((asks[0]["price"] - bids[0]["price"]) / midpoint * 100)
                                    if midpoint else None,
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            logger.error(f"Error analyzing Injective order book: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def calculate_technical_indicators(
        self,
        market_id: str,
        timeframe: str = "1h",
        lookback_periods: int = 14
    ) -> Dict[str, Any]:
        """Calculate key technical indicators for given market.

        Args:
            market_id: The Injective market ID to analyze
            timeframe: Time period for data aggregation ('5m', '15m', '1h', '4h', '1d')
            lookback_periods: Number of periods to look back for calculations

        Returns:
            Dictionary with technical indicators including RSI, MACD, Bollinger Bands
        """
        try:
            client = self._get_client()

            # Map Injective market ID to exchange symbol format
            market_info = client.get_spot_market(market_id=market_id)
            base = market_info.market.base_token.symbol
            quote = market_info.market.quote_token.symbol
            symbol = f"{base}/{quote}"

            # Use ccxt for historical candlestick data
            exchange = ccxt.kucoin()  # Use KuCoin as proxy (replace with direct Injective API when available)
            ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=lookback_periods + 50)

            # Convert to pandas DataFrame
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

            # Calculate technical indicators

            # RSI
            delta = df['close'].diff()
            gain = delta.mask(delta < 0, 0)
            loss = -delta.mask(delta > 0, 0)
            avg_gain = gain.rolling(window=lookback_periods).mean()
            avg_loss = loss.rolling(window=lookback_periods).mean()
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))

            # Moving Averages
            sma_20 = df['close'].rolling(window=20).mean()
            sma_50 = df['close'].rolling(window=50).mean()

            # Bollinger Bands
            sma = df['close'].rolling(window=lookback_periods).mean()
            std = df['close'].rolling(window=lookback_periods).std()
            upper_band = sma + (std * 2)
            lower_band = sma - (std * 2)

            # MACD
            ema_12 = df['close'].ewm(span=12, adjust=False).mean()
            ema_26 = df['close'].ewm(span=26, adjust=False).mean()
            macd_line = ema_12 - ema_26
            signal_line = macd_line.ewm(span=9, adjust=False).mean()

            # Get latest values
            latest_values = {
                "market_id": market_id,
                "symbol": symbol,
                "timeframe": timeframe,
                "last_price": df['close'].iloc[-1],
                "rsi": rsi.iloc[-1],
                "sma_20": sma_20.iloc[-1],
                "sma_50": sma_50.iloc[-1],
                "bollinger_upper": upper_band.iloc[-1],
                "bollinger_middle": sma.iloc[-1],
                "bollinger_lower": lower_band.iloc[-1],
                "macd_line": macd_line.iloc[-1],
                "macd_signal": signal_line.iloc[-1],
                "macd_histogram": macd_line.iloc[-1] - signal_line.iloc[-1],
                "timestamp": datetime.now().isoformat(),
            }

            return latest_values
        except Exception as e:
            logger.error(f"Error calculating technical indicators: {e}")
            return {"error": str(e)}

    @get_tool_schema
    def list_markets(self) -> Dict[str, Any]:
        """List all available markets on Injective.

        Returns:
            Dictionary with lists of spot, derivative, and perpetual markets
        """
        try:
            client = self._get_client()

            # Get all markets
            spot_markets = client.get_spot_markets()
            derivative_markets = client.get_derivative_markets()

            # Format spot markets
            spot_list = [
                {
                    "market_id": market.market_id,
                    "ticker": f"{market.base_token.symbol}/{market.quote_token.symbol}",
                    "base_token": market.base_token.symbol,
                    "quote_token": market.quote_token.symbol,
                    "min_price_tick_size": market.min_price_tick_size,
                    "min_quantity_tick_size": market.min_quantity_tick_size,
                }
                for market in spot_markets.markets
            ]

            # Format derivative markets
            derivative_list = [
                {
                    "market_id": market.market_id,
                    "ticker": market.ticker,
                    "oracle_base": market.oracle_base,
                    "oracle_quote": market.oracle_quote,
                    "perpetual": market.is_perpetual,
                    "min_price_tick_size": market.min_price_tick_size,
                    "min_quantity_tick_size": market.min_quantity_tick_size,
                }
                for market in derivative_markets.markets
            ]

            # Filter perpetuals
            perpetual_list = [market for market in derivative_list if market["perpetual"]]

            return {
                "spot_markets": spot_list,
                "derivative_markets": derivative_list,
                "perpetual_markets": perpetual_list,
                "total_markets": len(spot_list) + len(derivative_list),
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            logger.error(f"Error listing Injective markets: {e}")
            return {"error": str(e)}

    def get_tools(self) -> List[FunctionTool]:
        """Get all available tools in this toolkit."""
        return [
            FunctionTool(self.get_market_data),
            FunctionTool(self.analyze_order_book),
            FunctionTool(self.calculate_technical_indicators),
            FunctionTool(self.list_markets),
        ]