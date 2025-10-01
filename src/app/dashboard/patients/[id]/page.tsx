'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { User, FileText, DollarSign, Plus, Edit } from 'lucide-react'

interface Patient {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  gender?: string
  doctor?: { id: string; name: string }
  treatments: Array<{
    id: string
    diagnosis: string
    prescription?: string
    notes?: string
    createdAt: string
  }>
  labReports: Array<{
    id: string
    title: string
    description?: string
    fileUrl: string
    createdAt: string
  }>
  bills: Array<{
    id: string
    amount: number
    description: string
    status: string
    createdAt: string
  }>
}

export default function PatientDetailPage() {
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showTreatmentForm, setShowTreatmentForm] = useState(false)
  const [showAssignDoctor, setShowAssignDoctor] = useState(false)
  const [doctors, setDoctors] = useState<Array<{id: string; name: string}>>([])
  const [treatmentForm, setTreatmentForm] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  })

  useEffect(() => {
    fetchPatient()
    fetchDoctors()
  }, [params.id])

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPatient(data)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...')
      const response = await fetch('/api/users?role=DOCTOR')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Doctors data:', data)
        setDoctors(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch doctors:', response.status)
        setDoctors([])
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setDoctors([])
    }
  }

  const addTreatment = async () => {
    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...treatmentForm,
          patientId: params.id
        })
      })
      
      if (response.ok) {
        fetchPatient()
        setShowTreatmentForm(false)
        setTreatmentForm({ diagnosis: '', prescription: '', notes: '' })
      }
    } catch (error) {
      console.error('Error adding treatment:', error)
    }
  }

  const assignDoctor = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/patients/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId })
      })
      
      if (response.ok) {
        const updatedPatient = await response.json()
        setPatient(updatedPatient)
        setShowAssignDoctor(false)
        alert('Doctor assigned successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to assign doctor: ${error.error}`)
      }
    } catch (error) {
      console.error('Error assigning doctor:', error)
      alert('Failed to assign doctor. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!patient) return <div>Patient not found</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <p className="text-gray-600">{patient.phone}</p>
            {patient.email && <p className="text-gray-600">{patient.email}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAssignDoctor(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <User size={16} />
              Assign Doctor
            </button>
            <button
              onClick={() => setShowTreatmentForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Treatment
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Assigned Doctor:</span>
            <p className="font-medium">{patient.doctor?.name || 'Not assigned'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Gender:</span>
            <p className="font-medium">{patient.gender || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['overview', 'treatments', 'lab-reports', 'bills'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md capitalize ${
              activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Patient Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Name:</span> {patient.name}</p>
                <p><span className="text-gray-600">Phone:</span> {patient.phone}</p>
                {patient.email && <p><span className="text-gray-600">Email:</span> {patient.email}</p>}
                {patient.address && <p><span className="text-gray-600">Address:</span> {patient.address}</p>}
                {patient.gender && <p><span className="text-gray-600">Gender:</span> {patient.gender}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Medical Summary</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Assigned Doctor:</span> {patient.doctor?.name || 'Not assigned'}</p>
                <p><span className="text-gray-600">Total Treatments:</span> {(patient.treatments || []).length}</p>
                <p><span className="text-gray-600">Lab Reports:</span> {(patient.labReports || []).length}</p>
                <p><span className="text-gray-600">Bills:</span> {(patient.bills || []).length}</p>
                <p><span className="text-gray-600">Registration Date:</span> {new Date(patient.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'treatments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Treatment History</h2>
          </div>
          <div className="divide-y">
            {(patient.treatments || []).map((treatment) => (
              <div key={treatment.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{treatment.diagnosis}</h3>
                    {treatment.prescription && (
                      <p className="text-sm text-gray-600 mt-1">Prescription: {treatment.prescription}</p>
                    )}
                    {treatment.notes && (
                      <p className="text-sm text-gray-600 mt-1">Notes: {treatment.notes}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(treatment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'lab-reports' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Lab Reports</h2>
          </div>
          <div className="divide-y">
            {(patient.labReports || []).map((report) => (
              <div key={report.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  {report.description && (
                    <p className="text-sm text-gray-600">{report.description}</p>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FileText size={20} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Billing History</h2>
          </div>
          <div className="divide-y">
            {(patient.bills || []).map((bill) => (
              <div key={bill.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{bill.description}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">${bill.amount}</p>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    bill.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTreatmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Treatment</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Diagnosis"
                value={treatmentForm.diagnosis}
                onChange={(e) => setTreatmentForm({...treatmentForm, diagnosis: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Prescription"
                value={treatmentForm.prescription}
                onChange={(e) => setTreatmentForm({...treatmentForm, prescription: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <textarea
                placeholder="Notes"
                value={treatmentForm.notes}
                onChange={(e) => setTreatmentForm({...treatmentForm, notes: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={addTreatment}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Treatment
                </button>
                <button
                  onClick={() => setShowTreatmentForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Doctor</h2>
            <div className="space-y-2">
              <button
                onClick={() => assignDoctor('')}
                className="w-full text-left p-3 border rounded hover:bg-gray-50 text-red-600"
              >
                Unassign Doctor
              </button>
              {Array.isArray(doctors) && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => assignDoctor(doctor.id)}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50"
                  >
                    {doctor.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">
                  {Array.isArray(doctors) ? 'No doctors available' : 'Loading doctors...'}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAssignDoctor(false)}
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}