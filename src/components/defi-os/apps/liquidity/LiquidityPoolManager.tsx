import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Minus, RefreshCw } from 'lucide-react'
import { usePrivyAuth } from '@/contexts/PrivyAuthContext'
import { liquidityPoolService, PoolPosition, PoolMetrics } from '@/services/liquidity-pool'
import { BigNumberInBase } from '@injectivelabs/utils'

interface Props {
  theme: any
}

const LiquidityPoolManager: React.FC<Props> = ({ theme }) => {
  const [positions, setPositions] = useState<PoolPosition[]>([])
  const [metrics, setMetrics] = useState<{ [key: string]: PoolMetrics }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const { walletAddress } = usePrivyAuth()

  // Form states for adding liquidity
  const [token0Amount, setToken0Amount] = useState('')
  const [token1Amount, setToken1Amount] = useState('')
  const [slippageTolerance, setSlippageTolerance] = useState(0.5) // 0.5%

  useEffect(() => {
    if (walletAddress) {
      fetchUserPositions()
    }
  }, [walletAddress])

  const fetchUserPositions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const userPositions = await liquidityPoolService.getUserPoolPositions(walletAddress!)
      setPositions(userPositions)

      // Fetch metrics for each pool
      const metricsData: { [key: string]: PoolMetrics } = {}
      await Promise.all(
        userPositions.map(async (pos) => {
          const poolMetrics = await liquidityPoolService.getPoolMetrics(pos.poolId)
          metricsData[pos.poolId] = poolMetrics
        })
      )
      setMetrics(metricsData)
    } catch (err) {
      console.error('Failed to fetch positions:', err)
      setError('Failed to load liquidity positions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLiquidity = async () => {
    if (!selectedPool) return
    try {
      setIsLoading(true)
      await liquidityPoolService.addLiquidity(
        selectedPool,
        token0Amount,
        token1Amount,
        slippageTolerance
      )
      await fetchUserPositions()
      setToken0Amount('')
      setToken1Amount('')
    } catch (err) {
      console.error('Failed to add liquidity:', err)
      setError('Failed to add liquidity')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveLiquidity = async (poolId: string, shareAmount: string) => {
    try {
      setIsLoading(true)
      const position = positions.find(p => p.poolId === poolId)
      if (!position) return

      // Calculate minimum amounts with 1% slippage
      const minToken0 = new BigNumberInBase(position.token0Amount)
        .times(0.99)
        .toString()
      const minToken1 = new BigNumberInBase(position.token1Amount)
        .times(0.99)
        .toString()

      await liquidityPoolService.removeLiquidity(
        poolId,
        shareAmount,
        minToken0,
        minToken1
      )
      await fetchUserPositions()
    } catch (err) {
      console.error('Failed to remove liquidity:', err)
      setError('Failed to remove liquidity')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.colors.accent }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">{error}</div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      {/* Pool Positions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold"
            style={{ color: theme.colors?.text?.primary }}
          >
            Your Liquidity Positions
          </h2>
          <button
            onClick={fetchUserPositions}
            className="p-2 rounded-full hover:bg-opacity-80"
            style={{ background: theme.colors.accent }}
          >
            <RefreshCw className="w-4 h-4" style={{ color: theme.colors.background }} />
          </button>
        </div>

        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position.poolId}
              className="p-4 rounded-lg"
              style={{ background: theme.colors.secondary }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 style={{ color: theme.colors?.text?.primary }}>
                    {position.token0Symbol}/{position.token1Symbol}
                  </h3>
                  <p style={{ color: theme.colors?.text?.secondary }}>
                    Pool Share: {position.shareOfPool}%
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: theme.colors?.text?.primary }}>
                    APR: {position.apr}%
                  </p>
                  {metrics[position.poolId] && (
                    <p style={{ color: theme.colors?.text?.secondary }}>
                      IL: {metrics[position.poolId].impermanentLoss}%
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p style={{ color: theme.colors?.text?.secondary }}>
                    {position.token0Symbol}
                  </p>
                  <p style={{ color: theme.colors?.text?.primary }}>
                    {position.token0Amount}
                  </p>
                </div>
                <div>
                  <p style={{ color: theme.colors?.text?.secondary }}>
                    {position.token1Symbol}
                  </p>
                  <p style={{ color: theme.colors?.text?.primary }}>
                    {position.token1Amount}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPool(position.poolId)}
                  className="flex items-center px-3 py-1 rounded"
                  style={{ background: theme.colors.accent }}
                >
                  <Plus className="w-4 h-4 mr-1" style={{ color: theme.colors.background }} />
                  <span style={{ color: theme.colors.background }}>Add</span>
                </button>
                <button
                  onClick={() => handleRemoveLiquidity(position.poolId, position.shareOfPool)}
                  className="flex items-center px-3 py-1 rounded"
                  style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <Minus className="w-4 h-4 mr-1" style={{ color: theme.colors.accent }} />
                  <span style={{ color: theme.colors.accent }}>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Liquidity Form */}
      {selectedPool && (
        <div
          className="p-4 rounded-lg"
          style={{ background: theme.colors.secondary }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: theme.colors?.text?.primary }}
          >
            Add Liquidity
          </h3>

          <div className="space-y-4">
            <div>
              <label
                className="block mb-2"
                style={{ color: theme.colors?.text?.secondary }}
              >
                Token 0 Amount
              </label>
              <input
                type="text"
                value={token0Amount}
                onChange={(e) => setToken0Amount(e.target.value)}
                className="w-full p-2 rounded"
                style={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors?.text?.primary
                }}
              />
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: theme.colors?.text?.secondary }}
              >
                Token 1 Amount
              </label>
              <input
                type="text"
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                className="w-full p-2 rounded"
                style={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors?.text?.primary
                }}
              />
            </div>

            <div>
              <label
                className="block mb-2"
                style={{ color: theme.colors?.text?.secondary }}
              >
                Slippage Tolerance (%)
              </label>
              <input
                type="number"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(Number(e.target.value))}
                min="0.1"
                max="5"
                step="0.1"
                className="w-full p-2 rounded"
                style={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors?.text?.primary
                }}
              />
            </div>

            <button
              onClick={handleAddLiquidity}
              className="w-full py-2 rounded font-medium"
              style={{ background: theme.colors.accent, color: theme.colors.background }}
            >
              Add Liquidity
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiquidityPoolManager