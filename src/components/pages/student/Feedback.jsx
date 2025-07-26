import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Feedback = ({ user }) => {
  const [feedbackForms, setFeedbackForms] = useState([])
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState({})

  useEffect(() => {
    fetchFeedbackForms()
    fetchUserResponses()
  }, [])

  const fetchFeedbackForms = async () => {
    try {
      const data = await blink.db.feedbackForms.list({
        orderBy: { createdAt: 'desc' }
      })
      setFeedbackForms(data)
    } catch (error) {
      console.error('Error fetching feedback forms:', error)
    }
  }

  const fetchUserResponses = async () => {
    try {
      const userResponses = await blink.db.feedbackResponses.list({
        where: { userId: user.id }
      })
      const responsesMap = {}
      userResponses.forEach(response => {
        responsesMap[response.formId] = JSON.parse(response.responses)
      })
      setResponses(responsesMap)
    } catch (error) {
      console.error('Error fetching user responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = (formId, questionIndex, value) => {
    const formResponses = responses[formId] || []
    const updatedResponses = [...formResponses]
    updatedResponses[questionIndex] = value
    
    setResponses({
      ...responses,
      [formId]: updatedResponses
    })
  }

  const handleSubmit = async (formId) => {
    const formResponses = responses[formId]
    if (!formResponses || formResponses.some(r => !r || r.trim() === '')) {
      alert('Please answer all questions before submitting.')
      return
    }

    setSubmitting({ ...submitting, [formId]: true })

    try {
      await blink.db.feedbackResponses.create({
        id: `response_${Date.now()}_${user.id}`,
        formId: formId,
        userId: user.id,
        responses: JSON.stringify(formResponses),
        createdAt: new Date().toISOString()
      })

      alert('Feedback submitted successfully!')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setSubmitting({ ...submitting, [formId]: false })
    }
  }

  const hasSubmitted = (formId) => {
    return responses[formId] && responses[formId].length > 0
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
          <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
          <p className="text-gray-600">Share your thoughts and help improve campus services</p>
        </div>
      </div>

      {/* Feedback Forms */}
      <div className="space-y-6">
        {feedbackForms.length > 0 ? (
          feedbackForms.map((form) => {
            const questions = JSON.parse(form.questions)
            const formResponses = responses[form.id] || []
            const submitted = hasSubmitted(form.id)

            return (
              <div key={form.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">💬</span>
                      <h3 className="text-xl font-semibold text-gray-900">{form.title}</h3>
                      {submitted && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          SUBMITTED
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{form.description}</p>
                    
                    <div className="text-sm text-gray-500 mb-6">
                      <span>📅 Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                      <span className="ml-4">❓ {questions.length} Questions</span>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {index + 1}. {question}
                      </label>
                      <textarea
                        rows={3}
                        value={formResponses[index] || ''}
                        onChange={(e) => handleResponseChange(form.id, index, e.target.value)}
                        disabled={submitted}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          submitted ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                        placeholder={submitted ? 'Response submitted' : 'Type your response here...'}
                      />
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {submitted ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <span>✅</span>
                      <span className="font-medium">Thank you for your feedback!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubmit(form.id)}
                      disabled={submitting[form.id]}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {submitting[form.id] ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback forms available</h3>
            <p className="text-gray-600">
              Feedback forms will appear here once created by admin. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Feedback Statistics */}
      {feedbackForms.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Feedback Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {Object.keys(responses).filter(formId => hasSubmitted(formId)).length}
              </div>
              <div className="text-sm text-gray-600">Forms Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {feedbackForms.length - Object.keys(responses).filter(formId => hasSubmitted(formId)).length}
              </div>
              <div className="text-sm text-gray-600">Pending Forms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {feedbackForms.length > 0 ? Math.round((Object.keys(responses).filter(formId => hasSubmitted(formId)).length / feedbackForms.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Guidelines */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Feedback Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span>💡</span>
            <div>
              <div className="font-medium text-gray-900">Be Honest</div>
              <div className="text-gray-600">Your honest feedback helps improve campus services.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>📝</span>
            <div>
              <div className="font-medium text-gray-900">Be Specific</div>
              <div className="text-gray-600">Provide detailed responses for better understanding.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔒</span>
            <div>
              <div className="font-medium text-gray-900">Confidential</div>
              <div className="text-gray-600">Your feedback is kept confidential and secure.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>⏰</span>
            <div>
              <div className="font-medium text-gray-900">Timely Response</div>
              <div className="text-gray-600">Submit feedback promptly for relevant improvements.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback