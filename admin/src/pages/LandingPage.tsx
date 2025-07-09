import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Newspaper,
  FileText,
  Users,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass border-b border-white/10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Office of the Attorney General</h1>
                <p className="text-blue-200 text-sm">Government of Kenya</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Digital
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Government</span>
                  <br />Platform
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  A comprehensive administrative platform for managing the public digital website of the Office of the Attorney General. 
                  Efficiently handle public communications, citizen complaints, and maintain transparent government operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4"
                  >
                    <span>Access Admin Portal</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Security Notice */}
                <div className="glass-card rounded-2xl p-6 bg-white/10 backdrop-blur-lg border border-white/20">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-blue-400" />
                    Secure Access Required
                  </h3>
                  <p className="text-blue-200 text-sm">
                    This administrative portal requires authorized credentials. 
                    Contact your system administrator for access.
                  </p>
                </div>
              </div>
              
              <div className="relative animate-slide-in-right">
                <div className="glass-card rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Secure Access</h3>
                        <p className="text-gray-600 text-sm">Role-based authentication system</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Content Management</h3>
                        <p className="text-gray-600 text-sm">Streamlined news and communications</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Complaint Resolution</h3>
                        <p className="text-gray-600 text-sm">Efficient public service delivery</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Multi-Role Access</h3>
                        <p className="text-gray-600 text-sm">Department-specific permissions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="glass border-t border-white/10 px-6 py-8 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-200">
              © 2024 Office of the Attorney General, Government of Kenya. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}