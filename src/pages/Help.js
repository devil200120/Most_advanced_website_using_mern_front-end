import React, { useState } from 'react';
import './Help.css';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'fas fa-play-circle',
      description: 'Learn the basics of using ExamPro'
    },
    {
      id: 'taking-exams',
      title: 'Taking Exams',
      icon: 'fas fa-clipboard-list',
      description: 'How to take exams as a student'
    },
    {
      id: 'creating-exams',
      title: 'Creating Exams',
      icon: 'fas fa-plus-circle',
      description: 'Guide for teachers to create exams'
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      icon: 'fas fa-cog',
      description: 'Manage your account and preferences'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'fas fa-wrench',
      description: 'Common issues and solutions'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: 'fas fa-shield-alt',
      description: 'Learn about security features'
    }
  ];

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with ExamPro',
      sections: [
        {
          title: 'Creating Your Account',
          content: `
            <p>To get started with ExamPro, you'll need to create an account:</p>
            <ol>
              <li>Click the "Register" button on the homepage</li>
              <li>Choose your role (Student, Teacher, or Parent)</li>
              <li>Fill in your personal information</li>
              <li>Verify your email address</li>
              <li>Complete your profile setup</li>
            </ol>
            <p>Once your account is created, you can access all features based on your role.</p>
          `
        },
        {
          title: 'Dashboard Overview',
          content: `
            <p>Your dashboard is the central hub for all activities:</p>
            <ul>
              <li><strong>Statistics:</strong> View your performance metrics</li>
              <li><strong>Recent Activity:</strong> See your latest exams and results</li>
              <li><strong>Quick Actions:</strong> Access frequently used features</li>
              <li><strong>Notifications:</strong> Stay updated with important alerts</li>
            </ul>
          `
        },
        {
          title: 'Navigation',
          content: `
            <p>Use the navigation bar to access different sections:</p>
            <ul>
              <li><strong>Dashboard:</strong> Your main overview page</li>
              <li><strong>Exams:</strong> Browse available or created exams</li>
              <li><strong>Profile:</strong> Manage your personal information</li>
              <li><strong>Settings:</strong> Customize your preferences</li>
              <li><strong>Help:</strong> Access this help center</li>
            </ul>
          `
        }
      ]
    },
    'taking-exams': {
      title: 'Taking Exams',
      sections: [
        {
          title: 'Before Starting an Exam',
          content: `
            <p>Preparation is key to a successful exam experience:</p>
            <ul>
              <li>Ensure you have a stable internet connection</li>
              <li>Close unnecessary applications and browser tabs</li>
              <li>Find a quiet, well-lit environment</li>
              <li>Have any permitted materials ready</li>
              <li>Check the exam requirements and instructions</li>
            </ul>
          `
        },
        {
          title: 'During the Exam',
          content: `
            <p>Follow these guidelines during your exam:</p>
            <ul>
              <li>The exam will open in fullscreen mode for security</li>
              <li>Use the question palette to navigate between questions</li>
              <li>Your answers are automatically saved</li>
              <li>Monitor the timer in the top-right corner</li>
              <li>Mark questions for review if needed</li>
              <li>Avoid switching tabs or applications</li>
            </ul>
          `
        },
        {
          title: 'Submitting Your Exam',
          content: `
            <p>When you're ready to submit:</p>
            <ol>
              <li>Review all your answers using the question palette</li>
              <li>Click the "Submit Exam" button</li>
              <li>Confirm your submission in the dialog</li>
              <li>Wait for the confirmation message</li>
            </ol>
            <p><strong>Note:</strong> The exam will auto-submit when time expires.</p>
          `
        }
      ]
    },
    'creating-exams': {
      title: 'Creating Exams',
      sections: [
        {
          title: 'Exam Setup',
          content: `
            <p>Start by setting up your exam details:</p>
            <ul>
              <li><strong>Title:</strong> Give your exam a clear, descriptive name</li>
              <li><strong>Subject:</strong> Specify the subject area</li>
              <li><strong>Duration:</strong> Set the time limit in minutes</li>
              <li><strong>Schedule:</strong> Define start and end times</li>
              <li><strong>Instructions:</strong> Provide clear guidelines for students</li>
            </ul>
          `
        },
        {
          title: 'Adding Questions',
          content: `
            <p>ExamPro supports multiple question types:</p>
            <ul>
              <li><strong>Multiple Choice:</strong> Single correct answer from options</li>
              <li><strong>True/False:</strong> Binary choice questions</li>
              <li><strong>Essay:</strong> Open-ended text responses</li>
            </ul>
            <p>For each question, you can:</p>
            <ul>
              <li>Set point values</li>
              <li>Add explanations</li>
              <li>Include images</li>
              <li>Mark correct answers</li>
            </ul>
          `
        },
        {
          title: 'Security Settings',
          content: `
            <p>Configure security features to maintain exam integrity:</p>
            <ul>
              <li><strong>Fullscreen Mode:</strong> Prevents students from accessing other applications</li>
              <li><strong>Tab Switching Detection:</strong> Monitors for suspicious activity</li>
              <li><strong>Copy/Paste Prevention:</strong> Disables clipboard operations</li>
              <li><strong>Time Limits:</strong> Automatic submission when time expires</li>
            </ul>
          `
        }
      ]
    },
    'account-settings': {
      title: 'Account & Settings',
      sections: [
        {
          title: 'Profile Management',
          content: `
            <p>Keep your profile information up to date:</p>
            <ul>
              <li>Update personal information (name, email, phone)</li>
              <li>Upload a profile picture</li>
              <li>Add a bio or description</li>
              <li>Set your timezone and preferences</li>
            </ul>
          `
        },
        {
          title: 'Notification Preferences',
          content: `
            <p>Control how you receive notifications:</p>
            <ul>
              <li><strong>Email Notifications:</strong> Exam reminders and results</li>
              <li><strong>Push Notifications:</strong> Real-time browser alerts</li>
              <li><strong>System Updates:</strong> Platform news and maintenance</li>
            </ul>
          `
        },
        {
          title: 'Privacy Settings',
          content: `
            <p>Manage your privacy and data sharing:</p>
            <ul>
              <li>Control profile visibility</li>
              <li>Manage contact information sharing</li>
              <li>Set communication preferences</li>
              <li>Export your data</li>
            </ul>
          `
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      sections: [
        {
          title: 'Common Login Issues',
          content: `
            <p>If you're having trouble logging in:</p>
            <ul>
              <li>Check your email and password for typos</li>
              <li>Use the "Forgot Password" link to reset</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try using a different browser</li>
              <li>Disable browser extensions temporarily</li>
            </ul>
          `
        },
        {
          title: 'Exam Loading Problems',
          content: `
            <p>If an exam won't load or is running slowly:</p>
            <ul>
              <li>Check your internet connection speed</li>
              <li>Refresh the page and try again</li>
              <li>Close other browser tabs and applications</li>
              <li>Disable ad blockers for the site</li>
              <li>Contact support if the issue persists</li>
            </ul>
          `
        },
        {
          title: 'Technical Requirements',
          content: `
            <p>Ensure your system meets these requirements:</p>
            <ul>
              <li><strong>Browser:</strong> Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
              <li><strong>Internet:</strong> Stable broadband connection (5+ Mbps)</li>
              <li><strong>JavaScript:</strong> Must be enabled</li>
              <li><strong>Cookies:</strong> Must be enabled</li>
              <li><strong>Pop-ups:</strong> Allow for this site</li>
            </ul>
          `
        }
      ]
    },
    'security': {
      title: 'Security & Privacy',
      sections: [
        {
          title: 'Exam Security Features',
          content: `
            <p>ExamPro employs multiple security measures:</p>
            <ul>
              <li><strong>Fullscreen Enforcement:</strong> Exams run in secure fullscreen mode</li>
              <li><strong>Activity Monitoring:</strong> Detection of tab switching and suspicious behavior</li>
              <li><strong>Time Limits:</strong> Automatic submission prevents extended access</li>
              <li><strong>Browser Restrictions:</strong> Disabled right-click, copy/paste, and developer tools</li>
              <li><strong>Session Management:</strong> Automatic logout after inactivity</li>
            </ul>
          `
        },
        {
          title: 'Data Protection',
          content: `
            <p>Your data is protected through:</p>
            <ul>
              <li><strong>Encryption:</strong> All data transmitted using HTTPS/TLS</li>
              <li><strong>Secure Storage:</strong> Database encryption at rest</li>
              <li><strong>Access Controls:</strong> Role-based permissions</li>
              <li><strong>Regular Backups:</strong> Automated data backup procedures</li>
              <li><strong>Compliance:</strong> GDPR and educational privacy standards</li>
            </ul>
          `
        },
        {
          title: 'Best Practices',
          content: `
            <p>Follow these security best practices:</p>
            <ul>
              <li>Use a strong, unique password for your account</li>
              <li>Log out when using shared computers</li>
              <li>Keep your browser updated</li>
              <li>Don't share your login credentials</li>
              <li>Report suspicious activity immediately</li>
            </ul>
          `
        }
      ]
    }
  };

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the login page, enter your email address, and follow the instructions sent to your email."
    },
    {
      question: "Can I take an exam on my mobile device?",
      answer: "While ExamPro is mobile-responsive, we recommend using a desktop or laptop computer for the best exam experience, especially for longer exams."
    },
    {
      question: "What happens if my internet connection drops during an exam?",
      answer: "Your answers are automatically saved. If disconnected, log back in and continue from where you left off. Contact support if you experience issues."
    },
    {
      question: "Can I review my answers before submitting?",
      answer: "Yes, use the question palette to navigate through all questions and review your answers before final submission."
    },
    {
      question: "How are essay questions graded?",
      answer: "Essay questions are manually graded by instructors. You'll receive your results once the instructor completes the grading process."
    },
    {
      question: "Can I retake an exam?",
      answer: "Retake options depend on the exam settings configured by your instructor. Check the exam details or contact your instructor."
    },
    {
      question: "How do I contact technical support?",
      answer: "Use the contact form on our website, email support@exampro.com, or use the chat widget in the bottom-right corner."
    },
    {
      question: "Are my exam results immediately available?",
      answer: "Results for multiple-choice questions are typically available immediately. Essay questions require manual grading and may take longer."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>Help Center</h1>
        <p>Find answers to your questions and learn how to use ExamPro effectively</p>
        
        <div className="help-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="help-content">
        <div className="help-sidebar">
          <h3>Categories</h3>
          <nav className="help-nav">
            {categories.map(category => (
              <button
                key={category.id}
                className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <i className={category.icon}></i>
                <div className="nav-content">
                  <span className="nav-title">{category.title}</span>
                  <span className="nav-description">{category.description}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="help-main">
          {searchTerm ? (
            <div className="search-results">
              <h2>Search Results</h2>
              <div className="faq-section">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.question}</span>
                      <i className={`fas fa-chevron-${openFAQ === index ? 'up' : 'down'}`}></i>
                    </button>
                    {openFAQ === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
                {filteredFAQs.length === 0 && (
                  <p className="no-results">No results found for "{searchTerm}"</p>
                )}
              </div>
            </div>
          ) : (
            <div className="help-article">
              <h1>{helpContent[activeCategory].title}</h1>
              {helpContent[activeCategory].sections.map((section, index) => (
                <div key={index} className="help-section">
                  <h2>{section.title}</h2>
                  <div 
                    className="help-content-text"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="help-footer">
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.slice(0, 6).map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFAQ === `footer-${index}` ? 'active' : ''}`}
                  onClick={() => toggleFAQ(`footer-${index}`)}
                >
                  <span>{faq.question}</span>
                  <i className={`fas fa-chevron-${openFAQ === `footer-${index}` ? 'up' : 'down'}`}></i>
                </button>
                {openFAQ === `footer-${index}` && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="contact-section">
          <h3>Still Need Help?</h3>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <div className="contact-options">
            <a href="mailto:support@exampro.com" className="contact-btn">
              <i className="fas fa-envelope"></i>
              Email Support
            </a>
            <button className="contact-btn" onClick={() => alert('Chat feature coming soon!')}>
              <i className="fas fa-comments"></i>
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;