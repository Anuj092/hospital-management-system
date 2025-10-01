'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Upload, FileText } from 'lucide-react'

interface LabReportForm {
  patientId: string
  title: string
  description?: string
  file: FileList
}

export default function UploadLabReportPage() {
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LabReportForm>()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const data = await response.json()
      setPatients(data.patients || [])
    } catch (error) {
      toast.error('Failed to fetch patients')
    }
  }

  const onSubmit = async (data: LabReportForm) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('patientId', data.patientId)
      formData.append('title', data.title)
      if (data.description) {
        formData.append('description', data.description)
      }
      if (data.file && data.file[0]) {
        formData.append('file', data.file[0])
      }

      const response = await fetch('/api/lab-reports', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Lab report uploaded successfully!')
        router.push('/dashboard/lab-reports')
      } else {
        const result = await response.json()
        toast.error(result.error || 'Failed to upload lab report')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Lab Report</h1>
        <p className="text-gray-600">Upload a new lab report for a patient</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                {...register('patientId', { required: 'Patient is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                placeholder="e.g., Blood Test Results"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Additional notes or description about the report"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      {...register('file', { required: 'File is required' })}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{loading ? 'Uploading...' : 'Upload Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}