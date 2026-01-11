export const PROJECT_STRUCTURE = {
  name: 'AkadilEDU-v2',
  files: [
    { name: '.env', type: 'file', icon: 'FileCode' },
    { name: '.env.example', type: 'file', icon: 'FileCode' },
    { name: '.eslintrc.cjs', type: 'file', icon: 'FileCode' },
    { name: '.firebaserc', type: 'file', icon: 'FileCode' },
    { name: '.gitignore', type: 'file', icon: 'FileCode' },
    { name: 'package.json', type: 'file', icon: 'FileCode' },
    { name: 'README.md', type: 'file', icon: 'FileCode' },
    { name: 'firebase.json', type: 'file', icon: 'FileCode' },
    { name: 'index.html', type: 'file', icon: 'FileCode' },
    { name: 'vite.config.js', type: 'file', icon: 'FileCode' },
    { name: 'vercel.json', type: 'file', icon: 'FileCode' },
    { name: 'src', type: 'folder', icon: 'FolderOpen', children: [
      { name: 'App.jsx', type: 'file', icon: 'FileCode' },
      { name: 'main.jsx', type: 'file', icon: 'FileCode' },
      { name: 'i18n.js', type: 'file', icon: 'FileCode' },
      { name: 'api', type: 'folder', icon: 'FolderOpen', children: [] },
      { name: 'components', type: 'folder', icon: 'FolderOpen', children: [
        { name: 'AdminGuard.jsx', type: 'file', icon: 'FileCode' },
        { name: 'AppLoader.jsx', type: 'file', icon: 'FileCode' },
        { name: 'AppWrapper.jsx', type: 'file', icon: 'FileCode' },
        { name: 'BlockedAccountOverlay.jsx', type: 'file', icon: 'FileCode' },
        { name: 'CertificateGenerator.jsx', type: 'file', icon: 'FileCode' },
        { name: 'CookieConsent.jsx', type: 'file', icon: 'FileCode' },
        { name: 'CustomVideoPlayer.jsx', type: 'file', icon: 'FileCode' },
        { name: 'EmailVerificationBanner.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Header.jsx', type: 'file', icon: 'FileCode' },
        { name: 'MatchingDrag.jsx', type: 'file', icon: 'FileCode' },
        { name: 'ProfileModal.jsx', type: 'file', icon: 'FileCode' },
        { name: 'SessionRevokedModal.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Sidebar.jsx', type: 'file', icon: 'FileCode' },
        { name: 'ThreeLoader.jsx', type: 'file', icon: 'FileCode' },
        { name: 'UncompletedTestModal.jsx', type: 'file', icon: 'FileCode' },
        { name: 'admin', type: 'folder', icon: 'FolderOpen', children: [] },
        { name: 'test', type: 'folder', icon: 'FolderOpen', children: [] }
      ]},
      { name: 'firebase', type: 'folder', icon: 'FolderOpen', children: [
        { name: 'auth.js', type: 'file', icon: 'FileCode' },
        { name: 'config.js', type: 'file', icon: 'FileCode' },
        { name: 'firestore.js', type: 'file', icon: 'FileCode' },
        { name: 'messaging.js', type: 'file', icon: 'FileCode' },
        { name: 'realtimeDb.js', type: 'file', icon: 'FileCode' },
        { name: 'rtdbApi.js', type: 'file', icon: 'FileCode' },
        { name: 'sessionManager.js', type: 'file', icon: 'FileCode' },
        { name: 'storage.js', type: 'file', icon: 'FileCode' },
        { name: 'testModule.js', type: 'file', icon: 'FileCode' }
      ]},
      { name: 'hooks', type: 'folder', icon: 'FolderOpen', children: [] },
      { name: 'pages', type: 'folder', icon: 'FolderOpen', children: [
        { name: 'Admin.jsx', type: 'file', icon: 'FileCode' },
        { name: 'AuthAction.jsx', type: 'file', icon: 'FileCode' },
        { name: 'CourseDetail.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Courses.jsx', type: 'file', icon: 'FileCode' },
        { name: 'EmailVerificationRequired.jsx', type: 'file', icon: 'FileCode' },
        { name: 'ForgotPassword.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Home.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Login.jsx', type: 'file', icon: 'FileCode' },
        { name: 'MyCourses.jsx', type: 'file', icon: 'FileCode' },
        { name: 'NotFound.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Profile.jsx', type: 'file', icon: 'FileCode' },
        { name: 'ResetPassword.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Shop.jsx', type: 'file', icon: 'FileCode' },
        { name: 'Signup.jsx', type: 'file', icon: 'FileCode' },
        { name: 'TestUBT.jsx', type: 'file', icon: 'FileCode' },
        { name: 'VerifyEmail.jsx', type: 'file', icon: 'FileCode' },
        { name: 'admin', type: 'folder', icon: 'FolderOpen', children: [] }
      ]},
      { name: 'styles', type: 'folder', icon: 'FolderOpen', children: [] },
      { name: 'utils', type: 'folder', icon: 'FolderOpen', children: [] }
    ]},
    { name: 'backend', type: 'folder', icon: 'FolderOpen', children: [
      { name: '.gitignore', type: 'file', icon: 'FileCode' },
      { name: 'README.md', type: 'file', icon: 'FileCode' },
      { name: 'package.json', type: 'file', icon: 'FileCode' },
      { name: 'server.js', type: 'file', icon: 'FileCode' },
      { name: 'serviceAccountKey.json', type: 'file', icon: 'FileCode' },
      { name: 'vercel.json', type: 'file', icon: 'FileCode' }
    ]},
    { name: 'cloud', type: 'folder', icon: 'FolderOpen', children: [
      { name: 'functions', type: 'folder', icon: 'FolderOpen', children: [
        { name: 'aiParserStub.js', type: 'file', icon: 'FileCode' },
        { name: 'index.js', type: 'file', icon: 'FileCode' },
        { name: 'package.json', type: 'file', icon: 'FileCode' }
      ]}
    ]},
    { name: 'functions', type: 'folder', icon: 'FolderOpen', children: [] },
    { name: 'public', type: 'folder', icon: 'FolderOpen', children: [
      { name: 'firebase-messaging-sw.js', type: 'file', icon: 'FileCode' },
      { name: 'manifest.json', type: 'file', icon: 'FileCode' },
      { name: 'icons', type: 'folder', icon: 'FolderOpen', children: [
        { name: '.gitkeep', type: 'file', icon: 'FileCode' },
        { name: 'icon-144.png', type: 'file', icon: 'FileCode' },
        { name: 'icon-192.png', type: 'file', icon: 'FileCode' },
        { name: 'icon-512.png', type: 'file', icon: 'FileCode' },
        { name: 'logo-прозрачный.png', type: 'file', icon: 'FileCode' }
      ]}
    ]},
    { name: 'scripts', type: 'folder', icon: 'FolderOpen', children: [
      { name: '.gitignore', type: 'file', icon: 'FileCode' },
      { name: 'initAdmin.js', type: 'file', icon: 'FileCode' },
      { name: 'migrateAuthUsers.js', type: 'file', icon: 'FileCode' },
      { name: 'serviceAccountKey.example.json', type: 'file', icon: 'FileCode' },
      { name: 'serviceAccountKey.json', type: 'file', icon: 'FileCode' }
    ]}
  ]
};
