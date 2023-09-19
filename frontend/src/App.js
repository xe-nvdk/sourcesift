import React from 'react';
import './App.css';
import NewsFeed from './components/NewsFeed';
import { SourceProvider } from './contexts/SourceContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';

function App() {
  return (
    <SourceProvider>
      <Router>
        <Navbar />
        <div className="flex">
          <aside className="bg-gray-200 w-64 p-4">
          </aside>
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<NewsFeed />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </SourceProvider>
  );
}

export default App;
