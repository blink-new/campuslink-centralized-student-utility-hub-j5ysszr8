import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Polls = ({ user }) => {
  const [polls, setPolls] = useState([])
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState({})

  useEffect(() => {
    fetchPolls()
    fetchUserVotes()
  }, [])

  const fetchPolls = async () => {
    try {
      const data = await blink.db.polls.list({
        orderBy: { createdAt: 'desc' }
      })
      setPolls(data)
    } catch (error) {
      console.error('Error fetching polls:', error)
    }
  }

  const fetchUserVotes = async () => {
    try {
      const userVotes = await blink.db.pollVotes.list({
        where: { userId: user.id }
      })
      const votesMap = {}
      userVotes.forEach(vote => {
        votesMap[vote.pollId] = vote.optionIndex
      })
      setVotes(votesMap)
    } catch (error) {
      console.error('Error fetching user votes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (pollId, optionIndex) => {
    if (votes[pollId] !== undefined) return // Already voted

    setVoting({ ...voting, [pollId]: true })

    try {
      await blink.db.pollVotes.create({
        id: `vote_${Date.now()}_${user.id}`,
        pollId: pollId,
        userId: user.id,
        optionIndex: optionIndex,
        createdAt: new Date().toISOString()
      })

      setVotes({ ...votes, [pollId]: optionIndex })
    } catch (error) {
      console.error('Error voting:', error)
      alert('Error submitting vote. Please try again.')
    } finally {
      setVoting({ ...voting, [pollId]: false })
    }
  }

  const getPollResults = async (pollId) => {
    try {
      const pollVotes = await blink.db.pollVotes.list({
        where: { pollId: pollId }
      })
      return pollVotes
    } catch (error) {
      console.error('Error fetching poll results:', error)
      return []
    }
  }

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls</h1>
          <p className="text-gray-600">Participate in campus polls and surveys</p>
        </div>
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {polls.length > 0 ? (
          polls.map((poll) => {
            const options = JSON.parse(poll.options)
            const hasVoted = votes[poll.id] !== undefined
            const expired = isExpired(poll.expiresAt)
            const canVote = !hasVoted && !expired

            return (
              <div key={poll.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">📊</span>
                      <h3 className="text-xl font-semibold text-gray-900">{poll.question}</h3>
                      {expired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          EXPIRED
                        </span>
                      )}
                      {hasVoted && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          VOTED
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <span>📅 Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                      {poll.expiresAt && (
                        <span className="ml-4">
                          ⏰ Expires: {new Date(poll.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Poll Options */}
                <div className="space-y-3">
                  {options.map((option, index) => {
                    const isSelected = votes[poll.id] === index
                    const isVoting = voting[poll.id]

                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => handleVote(poll.id, index)}
                          disabled={!canVote || isVoting}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : canVote
                              ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                )}
                              </div>
                              <span className={`font-medium ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {option}
                              </span>
                            </div>
                            
                            {isSelected && (
                              <span className="text-blue-600 text-sm font-medium">
                                ✓ Your Choice
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Poll Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      {hasVoted ? (
                        <span className="text-green-600 font-medium">
                          ✓ You have voted in this poll
                        </span>
                      ) : expired ? (
                        <span className="text-red-600 font-medium">
                          ⏰ This poll has expired
                        </span>
                      ) : (
                        <span className="text-blue-600 font-medium">
                          📊 Click an option to vote
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs">
                      Poll ID: {poll.id.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls available</h3>
            <p className="text-gray-600">
              Polls will appear here once created by admin. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Voting Statistics */}
      {polls.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Voting Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Object.keys(votes).length}
              </div>
              <div className="text-sm text-gray-600">Polls Voted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-1">
                {polls.filter(p => !isExpired(p.expiresAt) && votes[p.id] === undefined).length}
              </div>
              <div className="text-sm text-gray-600">Available to Vote</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {polls.length > 0 ? Math.round((Object.keys(votes).length / polls.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Participation Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Guidelines */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Voting Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <div>
              <div className="font-medium text-gray-900">One Vote Per Poll</div>
              <div className="text-gray-600">You can only vote once in each poll. Choose carefully!</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>⏰</span>
            <div>
              <div className="font-medium text-gray-900">Check Expiry Dates</div>
              <div className="text-gray-600">Some polls have expiry dates. Vote before they expire.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔒</span>
            <div>
              <div className="font-medium text-gray-900">Anonymous Voting</div>
              <div className="text-gray-600">Your individual votes are kept private and secure.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>📊</span>
            <div>
              <div className="font-medium text-gray-900">Results</div>
              <div className="text-gray-600">Poll results may be shared after voting closes.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Polls