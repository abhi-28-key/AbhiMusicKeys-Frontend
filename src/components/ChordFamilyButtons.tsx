import React, { useState } from 'react';
import { Music, Play, Check } from 'lucide-react';

interface ChordFamily {
  name: string;
  chords: {
    name: string;
    notes: string[];
  }[];
}

const ChordFamilyButtons: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<ChordFamily | null>(null);
  const [completedFamilies, setCompletedFamilies] = useState<string[]>([]);

  const chordFamilies: ChordFamily[] = [
    {
      name: 'C Major Scale',
      chords: [
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'B-Diminished', notes: ['B', 'D', 'F'] }
      ]
    },
    {
      name: 'C# Major Scale',
      chords: [
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'B#-Diminished', notes: ['B#', 'D#', 'F#'] }
      ]
    },
    {
      name: 'D Major Scale',
      chords: [
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'C#-Diminished', notes: ['C#', 'E', 'G'] }
      ]
    },
    {
      name: 'D# Major Scale',
      chords: [
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'D-Diminished', notes: ['D', 'F', 'G#'] }
      ]
    },
    {
      name: 'E Major Scale',
      chords: [
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'D#-Diminished', notes: ['D#', 'F#', 'A'] }
      ]
    },
    {
      name: 'F Major Scale',
      chords: [
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'E-Diminished', notes: ['E', 'G', 'A#'] }
      ]
    },
    {
      name: 'F# Major Scale',
      chords: [
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'C#-Major', notes: ['C#', 'E#', 'G#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'E#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'E#-Diminished', notes: ['E#', 'G#', 'B'] }
      ]
    },
    {
      name: 'G Major Scale',
      chords: [
        { name: 'G-Major', notes: ['G', 'B', 'D'] },
        { name: 'C-Major', notes: ['C', 'E', 'G'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'A-Minor', notes: ['A', 'C', 'E'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'E-Minor', notes: ['E', 'G', 'B'] },
        { name: 'F#-Diminished', notes: ['F#', 'A', 'C'] }
      ]
    },
    {
      name: 'G# Major Scale',
      chords: [
        { name: 'G#-Major', notes: ['G#', 'C', 'D#'] },
        { name: 'C#-Major', notes: ['C#', 'F', 'G#'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'A#-Minor', notes: ['A#', 'C#', 'F'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'F-Minor', notes: ['F', 'G#', 'C'] },
        { name: 'G-Diminished', notes: ['G', 'A#', 'C#'] }
      ]
    },
    {
      name: 'A Major Scale',
      chords: [
        { name: 'A-Major', notes: ['A', 'C#', 'E'] },
        { name: 'D-Major', notes: ['D', 'F#', 'A'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'B-Minor', notes: ['B', 'D', 'F#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'F#-Minor', notes: ['F#', 'A', 'C#'] },
        { name: 'G#-Diminished', notes: ['G#', 'B', 'D'] }
      ]
    },
    {
      name: 'A# Major Scale',
      chords: [
        { name: 'A#-Major', notes: ['A#', 'D', 'F'] },
        { name: 'D#-Major', notes: ['D#', 'G', 'A#'] },
        { name: 'F-Major', notes: ['F', 'A', 'C'] },
        { name: 'C-Minor', notes: ['C', 'D#', 'G'] },
        { name: 'D-Minor', notes: ['D', 'F', 'A'] },
        { name: 'G-Minor', notes: ['G', 'A#', 'D'] },
        { name: 'A-Diminished', notes: ['A', 'C', 'D#'] }
      ]
    },
    {
      name: 'B Major Scale',
      chords: [
        { name: 'B-Major', notes: ['B', 'D#', 'F#'] },
        { name: 'E-Major', notes: ['E', 'G#', 'B'] },
        { name: 'F#-Major', notes: ['F#', 'A#', 'C#'] },
        { name: 'C#-Minor', notes: ['C#', 'E', 'G#'] },
        { name: 'D#-Minor', notes: ['D#', 'F#', 'A#'] },
        { name: 'G#-Minor', notes: ['G#', 'B', 'D#'] },
        { name: 'A#-Diminished', notes: ['A#', 'C#', 'E'] }
      ]
    }
  ];

  const handleFamilyClick = (family: ChordFamily) => {
    if (selectedFamily?.name === family.name) {
      setSelectedFamily(null);
    } else {
      setSelectedFamily(family);
    }
  };

  const markFamilyCompleted = (familyName: string) => {
    if (!completedFamilies.includes(familyName)) {
      setCompletedFamilies([...completedFamilies, familyName]);
    }
  };

  const isSharp = (note: string) => {
    return note.includes('#');
  };

  const NoteBox: React.FC<{ note: string; className?: string }> = ({ note, className = '' }) => (
    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 ${
      isSharp(note) 
        ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-600 dark:border-slate-400' 
        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-500'
    } ${className}`}>
      {note}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-4">
            🎼 Chord Family Sets
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Master all major scale families and their corresponding chords. Click on any family to explore the chords within that scale.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Progress: {completedFamilies.length} / {chordFamilies.length} Families Completed
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {Math.round((completedFamilies.length / chordFamilies.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedFamilies.length / chordFamilies.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Family Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {chordFamilies.map((family) => {
            const isCompleted = completedFamilies.includes(family.name);
            const isSelected = selectedFamily?.name === family.name;
            
            return (
              <div
                key={family.name}
                onClick={() => handleFamilyClick(family)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-blue-400'
                    : isCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-slate-700 dark:hover:to-slate-600'
                }`}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${
                    isSelected
                      ? 'bg-white/20 shadow-white/20'
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30'
                  }`}>
                    <Music className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                      {family.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {isCompleted ? '✅ Completed' : 'Click to explore'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Family Details Modal */}
        {selectedFamily && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                    🎼 {selectedFamily.name}
                  </h2>
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Explore all the chords in this scale family
                </p>
              </div>

              {/* Chords Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {selectedFamily.chords.map((chord, index) => (
                    <div
                      key={chord.name}
                      className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                    >
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                          {chord.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Chord {index + 1} of {selectedFamily.chords.length}
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-2 mb-3">
                        {chord.notes.map((note, noteIndex) => (
                          <NoteBox key={noteIndex} note={note} />
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto">
                          <Play className="w-4 h-4" />
                          Practice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => markFamilyCompleted(selectedFamily.name)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => setSelectedFamily(null)}
                    className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordFamilyButtons;
