'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    bookTitle: '',
    author: '',
    isbn: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Book request submitted successfully!');
        router.push('/student');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Book</h1>
        <p className="text-gray-600 mb-6">
          Can't find the book you're looking for? Request it to be added to our library collection.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                required
                value={formData.studentName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                id="studentEmail"
                name="studentEmail"
                required
                value={formData.studentEmail}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              required
              value={formData.bookTitle}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter the book title"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter the author's name"
            />
          </div>

          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
              ISBN (Optional)
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter ISBN if known"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Why do you need this book? *
            </label>
            <textarea
              id="reason"
              name="reason"
              required
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              className="input-field"
              placeholder="Please explain why this book would be valuable for the library..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}