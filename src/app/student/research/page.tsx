'use client';

import { useState } from 'react';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publication: string;
  year: number;
  doi: string;
  downloadUrl: string;
  citations: number;
  keywords: string[];
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  // Mock data - in a real app, this would come from an API
  const researchPapers: ResearchPaper[] = [
    {
      id: '1',
      title: 'Advances in Machine Learning for Natural Language Processing',
      authors: ['Dr. Alice Johnson', 'Prof. Bob Smith', 'Dr. Carol Davis'],
      abstract: 'This paper explores recent advancements in transformer-based models and their applications in various NLP tasks including sentiment analysis, machine translation, and text generation.',
      publication: 'Journal of Artificial Intelligence Research',
      year: 2024,
      doi: '10.1234/jair.2024.123',
      downloadUrl: '#',
      citations: 142,
      keywords: ['Machine Learning', 'NLP', 'Transformers', 'AI']
    },
    {
      id: '2',
      title: 'Sustainable Energy Solutions: Solar Cell Efficiency Improvements',
      authors: ['Dr. David Wilson', 'Prof. Emma Brown'],
      abstract: 'Research on perovskite solar cells demonstrating significant improvements in energy conversion efficiency and long-term stability under various environmental conditions.',
      publication: 'Renewable Energy Journal',
      year: 2024,
      doi: '10.1234/re.2024.456',
      downloadUrl: '#',
      citations: 89,
      keywords: ['Renewable Energy', 'Solar Cells', 'Perovskite', 'Sustainability']
    },
    {
      id: '3',
      title: 'Quantum Computing: Breaking New Ground in Cryptography',
      authors: ['Dr. Frank Miller', 'Dr. Grace Lee', 'Prof. Henry Taylor'],
      abstract: 'This study presents novel quantum algorithms that challenge current cryptographic standards and proposes new quantum-resistant encryption methods.',
      publication: 'Quantum Science Review',
      year: 2023,
      doi: '10.1234/qsr.2023.789',
      downloadUrl: '#',
      citations: 203,
      keywords: ['Quantum Computing', 'Cryptography', 'Algorithms', 'Security']
    },
    {
      id: '4',
      title: 'Neuroplasticity and Learning: Brain Adaptation Mechanisms',
      authors: ['Dr. Isabella Garcia', 'Prof. James Anderson'],
      abstract: 'Comprehensive analysis of neuroplastic changes during learning processes, with implications for educational methodologies and cognitive rehabilitation.',
      publication: 'Neuroscience Today',
      year: 2024,
      doi: '10.1234/nt.2024.321',
      downloadUrl: '#',
      citations: 67,
      keywords: ['Neuroscience', 'Learning', 'Neuroplasticity', 'Education']
    },
    {
      id: '5',
      title: 'Climate Change Impact on Marine Biodiversity',
      authors: ['Dr. Kevin Martin', 'Dr. Lisa White', 'Prof. Michael Clark'],
      abstract: 'Long-term study examining the effects of ocean acidification and temperature changes on coral reefs and marine ecosystems in the Pacific Ocean.',
      publication: 'Marine Biology Research',
      year: 2023,
      doi: '10.1234/mbr.2023.654',
      downloadUrl: '#',
      citations: 156,
      keywords: ['Climate Change', 'Marine Biology', 'Biodiversity', 'Ecology']
    },
    {
      id: '6',
      title: 'Blockchain Technology in Supply Chain Management',
      authors: ['Dr. Nancy Adams', 'Prof. Oscar Rodriguez'],
      abstract: 'Implementation framework for blockchain technology to enhance transparency, traceability, and efficiency in global supply chain operations.',
      publication: 'Business Technology Review',
      year: 2024,
      doi: '10.1234/btr.2024.987',
      downloadUrl: '#',
      citations: 94,
      keywords: ['Blockchain', 'Supply Chain', 'Technology', 'Business']
    }
  ];

  const filteredPapers = researchPapers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Papers</h1>
        <p className="text-gray-600 mb-6">Explore academic research and scientific publications</p>
        
        <div className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search research papers by title, author, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent shadow-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredPapers.length} of {researchPapers.length} research papers
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Research Papers Grid */}
      {filteredPapers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No research papers found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No papers match your search for "${searchQuery}"`
              : 'No research papers available yet'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-academic-blue hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPapers.map((paper) => (
            <div 
              key={paper.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-6"
              onClick={() => setSelectedPaper(paper)}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-academic-blue transition-colors duration-200">
                    {paper.title}
                  </h3>
                  
                  {/* Authors */}
                  <p className="text-sm text-gray-600 mb-3">
                    by {paper.authors.join(', ')}
                  </p>
                  
                  {/* Publication and Year */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{paper.publication}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    <span>•</span>
                    <span>{paper.citations} citations</span>
                  </div>
                  
                  {/* Abstract Preview */}
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {paper.abstract}
                  </p>
                  
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* DOI and Action */}
                <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                  <div className="text-sm text-gray-500 mb-2">
                    DOI: {paper.doi}
                  </div>
                  <button className="text-academic-blue hover:text-blue-700 font-medium text-sm">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Research Paper Details Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Research Paper Details</h2>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Title and Authors */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPaper.title}</h3>
                  <p className="text-lg text-gray-600">
                    {selectedPaper.authors.join(', ')}
                  </p>
                </div>

                {/* Publication Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Publication:</span>
                    <p className="text-gray-600">{selectedPaper.publication}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year:</span>
                    <p className="text-gray-600">{selectedPaper.year}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Citations:</span>
                    <p className="text-gray-600">{selectedPaper.citations}</p>
                  </div>
                </div>

                {/* DOI */}
                <div>
                  <span className="font-medium text-gray-700">DOI:</span>
                  <p className="text-gray-600 font-mono text-sm">{selectedPaper.doi}</p>
                </div>

                {/* Abstract */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Abstract</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedPaper.abstract}</p>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-academic-blue text-white text-sm px-3 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-academic-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2">
                    <span>📥</span>
                    <span>Download Research Paper</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    PDF format • Peer-reviewed • Academic use permitted
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}