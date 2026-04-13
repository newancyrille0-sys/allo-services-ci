import { SMSTester } from "@/components/admin/SMSTester";

export default function AdminSMSPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#004150]">Test SMS Yellika</h1>
          <p className="text-gray-600 mt-2">
            Testez l&apos;envoi de SMS via l&apos;API Yellika pour Allo Services CI
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2">Configuration API</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Provider:</span>
              <span className="ml-2 font-medium">Yellika SMS</span>
            </div>
            <div>
              <span className="text-gray-500">Sender ID:</span>
              <span className="ml-2 font-medium">ALLOSERVICES</span>
            </div>
            <div>
              <span className="text-gray-500">API URL:</span>
              <span className="ml-2 font-mono text-xs">panel.yellikasms.com/api/v3/sms/send</span>
            </div>
            <div>
              <span className="text-gray-500">Auth:</span>
              <span className="ml-2 font-medium">OAuth2.0 Bearer Token</span>
            </div>
          </div>
        </div>

        <SMSTester />

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-2">📋 APIs Disponibles</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <code className="bg-blue-100 px-2 py-1 rounded">POST /api/auth/otp/send</code>
              <span className="text-gray-600">- Envoyer un code OTP</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-blue-100 px-2 py-1 rounded">PUT /api/auth/otp/verify</code>
              <span className="text-gray-600">- Vérifier un code OTP</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-blue-100 px-2 py-1 rounded">POST /api/sms/send</code>
              <span className="text-gray-600">- Envoyer un SMS</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="bg-blue-100 px-2 py-1 rounded">GET /api/sms/balance</code>
              <span className="text-gray-600">- Vérifier le solde</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
