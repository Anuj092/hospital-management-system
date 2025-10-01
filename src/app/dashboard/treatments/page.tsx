'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, FileText } from 'lucide-react'

interface Treatment {
  id: string
  diagnosis: string
  prescription?: string
  notes?: string
  createdAt: string
  patient: { name: string }
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTreatments()
  }, [])

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments')
      if (response.ok) {
        const data = await response.json()
        setTreatments(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching treatments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTreatments = treatments.filter(treatment =>
    treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treatment Records</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search treatments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTreatments.map((treatment) => (
              <tr key={treatment.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{treatment.patient.name}</td>
                <td className="px-6 py-4">{treatment.diagnosis}</td>
                <td className="px-6 py-4">{treatment.prescription || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(treatment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTreatments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No treatments found
          </div>
        )}
      </div>
    </div>
  )
}