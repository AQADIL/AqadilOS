import { FileText, FolderOpen, Terminal, Github, Send, Calendar, Music, Globe, Gamepad2, Zap, Settings, User, Heart, CreditCard } from 'lucide-react';
import Notepad from '../components/apps/Notepad';
import Explorer from '../components/apps/Explorer';
import TerminalApp from '../components/apps/Terminal';
import Calculator from '../components/apps/Calculator';
import CalendarApp from '../components/apps/Calendar';
import MusicPlayer from '../components/apps/MusicPlayer';
import BrowserApp from '../components/apps/Browser';
import NeonDrift from '../components/apps/games/NeonDrift';
import SystemOverride from '../components/apps/games/SystemOverride';
import DevTycoon from '../components/apps/games/DevTycoon';
import ExternalLinkApp from '../components/apps/ExternalLinkApp';
import SettingsApp from '../components/apps/SettingsApp';
import ContactApp from '../components/apps/ContactApp';
import ContactWallet from '../components/apps/ContactWallet';
import DonateApp from '../components/apps/DonateApp';


const CyberLock = SystemOverride;

const iconStyle = { strokeWidth: 1.5 };


const createExplorerComponent = (props = {}) => <Explorer {...props} />;


const createCalculatorComponent = (props = {}) => <Calculator {...props} />;


const createCalendarComponent = (props = {}) => <CalendarApp {...props} />;


const createMusicPlayerComponent = (props = {}) => <MusicPlayer {...props} />;


const createExternalLinkComponent = (url) => <ExternalLinkApp url={url} />;


const createBrowserComponent = (props = {}) => <BrowserApp {...props} />;


const CalculatorIcon = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="5" y="6" width="14" height="2" fill="currentColor"/>
    <rect x="5" y="10" width="3" height="2" fill="currentColor"/>
    <rect x="10" y="10" width="3" height="2" fill="currentColor"/>
    <rect x="15" y="10" width="3" height="2" fill="currentColor"/>
    <rect x="5" y="14" width="3" height="2" fill="currentColor"/>
    <rect x="10" y="14" width="3" height="2" fill="currentColor"/>
    <rect x="15" y="14" width="3" height="2" fill="currentColor"/>
    <rect x="5" y="18" width="3" height="2" fill="currentColor"/>
    <rect x="10" y="18" width="8" height="2" fill="currentColor"/>
  </svg>
);

export const APPS_CONFIG = {
  notepad: {
    id: 'notepad',
    title: 'Resume.txt',
    icon: <FileText {...iconStyle} className="text-blue-400" />,
    component: <Notepad />,
    defaultSize: { width: 800, height: 600 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  explorer: {
    id: 'explorer',
    title: 'Project Files',
    icon: <FolderOpen {...iconStyle} fill="currentColor" className="text-yellow-500" />,
    component: createExplorerComponent(),
    defaultSize: { width: 900, height: 550 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: <Terminal {...iconStyle} className="text-gray-100" />,
    component: <TerminalApp />,
    defaultSize: { width: 700, height: 450 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: <CalculatorIcon size={16} className="text-blue-400" />,
    component: createCalculatorComponent(),
    defaultSize: { width: 320, height: 520 },
    mobileSize: { width: 320, height: '80vh' },
    isExternal: false,
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar',
    icon: <Calendar {...iconStyle} className="text-purple-400" />,
    component: createCalendarComponent(),
    defaultSize: { width: 800, height: 520 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  musicplayer: {
    id: 'musicplayer',
    title: 'Music Player',
    icon: <Music {...iconStyle} className="text-green-400" />,
    component: createMusicPlayerComponent(),
    defaultSize: { width: 850, height: 500 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  browser: {
    id: 'browser',
    title: 'Akadilium Browser',
    icon: <Globe {...iconStyle} className="text-blue-400" />,
    component: createBrowserComponent(),
    defaultSize: { width: 900, height: 600 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  neonDrift: {
    id: 'neonDrift',
    title: 'Neon Drift',
    icon: <img src="/neon-drift.png" style={{ width: 50, height: 50 }} alt="Neon Drift" />,
    component: <NeonDrift />,
    defaultSize: { width: 900, height: 600 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  systemOverride: {
    id: 'systemOverride',
    title: 'Cyber Lock',
    icon: <img src="/cyber-lock.png" style={{ width: 50, height: 50 }} alt="Cyber Lock" />,
    component: <CyberLock />,
    defaultSize: { width: 900, height: 650 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  devTycoon: {
    id: 'devTycoon',
    title: 'Dev Tycoon Pro',
    icon: <img src="/dev-tycoon.png" style={{ width: 50, height: 50 }} alt="Dev Tycoon Pro" />,
    component: <DevTycoon />,
    defaultSize: { width: 1200, height: 700 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  github: {
    id: 'github',
    title: 'GitHub',
    icon: <Github {...iconStyle} className="text-white" />,
    component: createExternalLinkComponent("https://github.com/aqadil"),
    defaultSize: { width: 500, height: 300 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: true,
  },
  telegram: {
    id: 'telegram',
    title: 'Telegram',
    icon: <Send {...iconStyle} className="text-blue-500" />,
    component: createExternalLinkComponent("https://t.me/wellpussy"),
    defaultSize: { width: 500, height: 300 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: true,
  },
  akadiledu: {
    id: 'akadiledu',
    title: 'AkadilEDU',
    icon: <img src="/logo.png" style={{ width: 50, height: 50 }} alt="AkadilEDU" />,
    component: createExternalLinkComponent("https://akadiledu.com"),
    defaultSize: { width: 500, height: 300 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: true,
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: <Settings {...iconStyle} className="text-blue-400" />,
    component: <SettingsApp />,
    defaultSize: { width: 960, height: 620 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  contact: {
    id: 'contact',
    title: 'Contact Me',
    icon: <CreditCard {...iconStyle} className="text-emerald-400" />,
    component: <ContactWallet />,
    defaultSize: { width: 800, height: 600 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
  donate: {
    id: 'donate',
    title: 'Support / Donate',
    icon: <Heart {...iconStyle} className="text-pink-500" />,
    component: <DonateApp />,
    defaultSize: { width: 720, height: 520 },
    mobileSize: { width: '95vw', height: '80vh' },
    isExternal: false,
  },
};
