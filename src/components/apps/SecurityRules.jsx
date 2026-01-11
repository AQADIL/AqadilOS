import React, { useState } from 'react';
import { Shield, Save, Copy, Check, Lock, Database, FileText, Server } from 'lucide-react';

export default function SecurityRules() {
  const [activeTab, setActiveTab] = useState('firestore');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const rules = {
    firestore: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    

    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    

    match /progress/{userId}/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`,
    storage: `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    

    match /courses/{courseId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}`,
    realtime: `{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "courses": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.admin === true"
    }
  }
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rules[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'firestore', label: 'Firestore', icon: Database },
    { id: 'storage', label: 'Storage', icon: FileText },
    { id: 'realtime', label: 'Realtime DB', icon: Server }
  ];

  return (
    <div className='h-full bg-[#181818] text-white p-6 overflow-auto'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-3 mb-8'>
          <Shield className='text-blue-400' size={32} />
          <div>
            <h1 className='text-3xl font-bold'>Security Rules</h1>
            <p className='text-gray-400'>Firebase Security Configuration</p>
          </div>
        </div>

        <div className='bg-[#202020] border border-gray-700 rounded-xl p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <Lock className='text-green-400' size={24} />
              <span className='text-lg font-semibold'>Security Status: Protected</span>
            </div>
            <div className='text-sm text-gray-400'>
              Last updated: 2 hours ago
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex items-center gap-2'>
              <Check size={16} className='text-green-400' />
              <span className='text-sm'>Authentication enabled</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check size={16} className='text-green-400' />
              <span className='text-sm'>Admin role validation</span>
            </div>
            <div className='flex items-center gap-2'>
              <Check size={16} className='text-green-400' />
              <span className='text-sm'>Data isolation active</span>
            </div>
          </div>
        </div>

        {}
        <div className='bg-[#202020] border border-gray-700 rounded-xl p-6 mb-6'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <Lock className='text-blue-400' size={20} />
            Session Management
          </h3>
          <div className='space-y-3'>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>Session Revocation</div>
              <div className='text-sm text-gray-400'>First session automatically disconnects when second session is detected</div>
            </div>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>Device Fingerprinting</div>
              <div className='text-sm text-gray-400'>Tracks device characteristics to prevent account sharing</div>
            </div>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>IP Monitoring</div>
              <div className='text-sm text-gray-400'>Real-time IP tracking for unauthorized access detection</div>
            </div>
          </div>
        </div>

        <div className='flex gap-2 mb-6 border-b border-gray-700'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className='bg-[#202020] border border-gray-700 rounded-xl overflow-hidden'>
          <div className='flex items-center justify-between p-4 border-b border-gray-700 bg-[#252525]'>
            <div className='flex items-center gap-2'>
              <FileText size={18} className='text-blue-400' />
              <span className='font-medium'>{tabs.find(t => t.id === activeTab)?.label} Rules</span>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleCopy}
                className='flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors'
              >
                {copied ? <Check size={16} className='text-green-400' /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
                          </div>
          </div>
          
          <div className='p-4'>
            <textarea
              value={rules[activeTab]}
              readOnly
              className='w-full h-96 bg-[#181818] text-white font-mono text-sm p-4 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none'
              spellCheck={false}
            />
          </div>
        </div>

        <div className='mt-6 bg-[#202020] border border-gray-700 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-4'>Rule Information</h3>
          <div className='space-y-3'>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>Firestore Rules</div>
              <div className='text-sm text-gray-400'>Controls access to Cloud Firestore database with user-based permissions</div>
            </div>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>Storage Rules</div>
              <div className='text-sm text-gray-400'>Manages file upload and download permissions for Firebase Storage</div>
            </div>
            <div className='p-3 bg-[#252525] rounded-lg'>
              <div className='font-medium text-blue-400 mb-1'>Realtime Database Rules</div>
              <div className='text-sm text-gray-400'>Secures real-time data synchronization with JSON-based rules</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
