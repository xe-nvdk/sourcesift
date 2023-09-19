import React, { useEffect, useContext } from 'react';
import { SourceContext } from '../contexts/SourceContext';
import './NewsFeed.css'
import AudioPlayer from './AudioPlayer';

function NewsFeed() {
    const { sources } = useContext(SourceContext);
    const [newsData, setNewsData] = React.useState([]);

    useEffect(() => {
        const promises = sources.map(source => {
            const url = `http://127.0.0.1:8000/fetch_rss/?url=${source}`;
            return fetch(url)
                .then(res => res.json())
                .then(data => data.data)
        });

        Promise.all(promises)
            .then(results => {
                let items = [];
                results.forEach(result => {
                    items = items.concat(result);
                });
                items.sort((a, b) => new Date(b.published) - new Date(a.published));
                setNewsData(items);
            });
    }, [sources]);

    // Separate the podcasts from the news articles
    const podcasts = newsData.filter(item => item.enclosure);
    const newsItems = newsData.filter(item => !item.enclosure);

    const chunkArray = (array, size) => {
        const chunked_arr = [];
        for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunked_arr.push(chunk);
    }
    return chunked_arr;
    };

    const newsChunks = chunkArray(newsItems, 5);
    const podcastChunks = chunkArray(podcasts, 5);

return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <div className="mt-8 mb-4 text-xl font-bold pl-4">News</div>
            
            {newsChunks.map((chunk, index) => (
                <div key={index} className="flex mt-4 flex-wrap justify-center">
                    {chunk.map(item => (
                        <div key={item.link} className="card">
                            {item['itunes:image'] && 
                                <img src={item['itunes:image']} alt={item.title} className="card-image" />
                            }
                            <h2 className="text-xl mb-2 font-bold card-title">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">
                                    {item.title}
                                </a>
                            </h2>
                            <p className="card-description">{item.description}</p>
                        </div>
                    ))}
                </div>
            ))}
            
            <div className="mt-8 mb-4 text-xl font-bold pl-4">Podcasts</div>
            
            {podcastChunks.map((chunk, index) => (
                <div key={index} className="flex mt-4 flex-wrap justify-center">
                    {chunk.map(item => (
                        <div key={item.link} className="card">
                            {item['itunes:image'] && 
                                <img src={item['itunes:image']} alt={item.title} className="card-image" />
                            }
                            <h2 className="text-xl mb-2 font-bold card-title">
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">
                                    {item.title}
                                </a>
                            </h2>
                            <p className="card-description">{item.description}</p>
    
                            {/* Render audio player for podcasts */}
                            {item.enclosure && 
                                (item.enclosure.type === 'audio/x-m4a' || item.enclosure.type === 'audio/mpeg') && 
                                <AudioPlayer url={item.enclosure.href} type={item.enclosure.type} className="mt-4" />
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default NewsFeed;
    