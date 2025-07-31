import React, { useState } from 'react';
import { Bell, Shield, Globe, Palette, Zap, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Get notified about trending topics and AI insights',
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      icon: Shield,
      settings: [
        {
          id: 'dataSharing',
          label: 'Anonymous Data Sharing',
          description: 'Help improve trend predictions by sharing anonymized data',
          value: dataSharing,
          onChange: setDataSharing,
        },
      ],
    },
    {
      title: 'AI Features',
      icon: Zap,
      settings: [
        {
          id: 'autoAnalysis',
          label: 'Automatic Analysis',
          description: 'Let AI continuously analyze trends based on your preferences',
          value: autoAnalysis,
          onChange: setAutoAnalysis,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Customize your Taste2Trends experience</p>
        </div>

        <div className="divide-y divide-gray-100">
          {settingsSections.map((section) => (
            <div key={section.title} className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <section.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>

              <div className="space-y-4 ml-10">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="font-medium text-gray-900 block mb-1">
                        {setting.label}
                      </label>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        setting.value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">API Configuration</h3>
              <p className="text-sm text-gray-600">Manage your external service connections</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div>
              <h4 className="font-medium text-green-900">OpenAI Integration</h4>
              <p className="text-sm text-green-600">Connected and active</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Qloo Platform</h4>
              <p className="text-sm text-blue-600">Cultural taste intelligence active</p>
            </div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};