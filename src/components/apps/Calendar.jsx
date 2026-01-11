import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Bell, MapPin } from 'lucide-react';

export default function CalendarApp() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Daily Scrum',
      date: new Date(),
      time: '10:00 AM',
      location: 'Zoom Meeting',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'AQADIL OS v2 Release',
      date: new Date(),
      time: '23:59 PM',
      location: '',
      type: 'deadline'
    }
  ]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    location: '',
    type: 'meeting'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(viewDate);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      const event = {
        id: Date.now(),
        ...newEvent,
        date: selectedDate
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        date: new Date(),
        time: '',
        location: '',
        type: 'meeting'
      });
      setShowEventModal(false);
    }
  };

  const openEventModal = (date) => {
    setSelectedDate(date);
    setNewEvent({
      title: '',
      date: date,
      time: '',
      location: '',
      type: 'meeting'
    });
    setShowEventModal(true);
  };

  const getEventsForDay = (day) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === viewDate.getMonth() && 
      event.date.getFullYear() === viewDate.getFullYear()
    );
  };

  return (
    <div className="relative w-full h-full bg-[#0f0f11] text-white overflow-hidden font-sans">
      
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] bg-pink-500 rounded-full blur-[90px] opacity-20"></div>

      {}
      <div className="absolute inset-0 z-10 flex">
        
        {}
        <div className="w-[280px] h-full bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col p-6 relative">
          {}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            {}
            <div className="mt-4">
              <h1 className="text-7xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </h1>
              <p className="text-blue-200/80 text-lg font-medium mt-1 ml-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {}
            <div className="mt-8 space-y-3 flex-1">
              <div className="group bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 cursor-pointer backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Upcoming</span>
                  <span className="text-xs text-gray-400">10:00 AM</span>
                </div>
                <h3 className="font-medium text-lg leading-tight">Team Daily Scrum</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span>Zoom Meeting</span>
                </div>
              </div>

              <div className="group bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-4 cursor-pointer backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Deadline</span>
                  <span className="text-xs text-gray-400">23:59 PM</span>
                </div>
                <h3 className="font-medium text-lg leading-tight">AQADIL OS v2 Release</h3>
              </div>
            </div>

            {}
            <button 
              onClick={() => setShowEventModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium shadow-lg shadow-blue-900/20 backdrop-blur-sm transition-all active:scale-95 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
              <span className="group-hover:text-white/90 transition-colors">New Event</span>
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 h-full bg-black/20 backdrop-blur-xl p-8 flex flex-col">
          
          {}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Select Date</span>
              <h2 className="text-3xl font-bold text-white">{months[viewDate.getMonth()]} <span className="text-white/40">{viewDate.getFullYear()}</span></h2>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-md text-gray-300 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-md text-gray-300 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-7 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-white/40 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          {}
          <div className="grid grid-cols-7 gap-3 content-start">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}

            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const today = isToday(day);
              const selected = isSelected(day);

              return (
                <button
                  key={day}
                  onClick={() => openEventModal(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                  className={`
                    relative h-10 w-full rounded-xl flex flex-col items-center justify-center transition-all duration-300 group
                    ${today 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105 font-bold z-10' 
                      : 'text-gray-300 hover:bg-white/5 hover:scale-105'
                    }
                    ${selected && !today 
                      ? 'bg-white/10 border border-white/20 text-white' 
                      : ''
                    }
                  `}
                >
                  <span className="text-sm">{day}</span>
                  {}
                  {[3, 14, 25].includes(day) && !today && (
                    <div className="absolute bottom-1.5 w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_5px_currentColor]"></div>
                  )}
                </button>
              );
            })}
          </div>
          
        </div>
      </div>

      {}
      {showEventModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[400px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Create New Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter event title..."
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Date</label>
                <input
                  type="date"
                  value={newEvent.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewEvent({...newEvent, date: new Date(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Time</label>
                <input
                  type="text"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="10:00 AM"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Zoom Meeting / Office..."
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="meeting" className="bg-gray-800">Meeting</option>
                  <option value="deadline" className="bg-gray-800">Deadline</option>
                  <option value="reminder" className="bg-gray-800">Reminder</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}