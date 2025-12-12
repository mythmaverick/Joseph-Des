import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import SellerDashboard from './components/SellerDashboard';
import Auth from './components/Auth';
import ChatTracker from './components/ChatTracker';
import { Product, UserRole, University, ChatSession, Message } from './types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Chinedu (Eng)',
    university: University.UNILAG,
    title: 'Fairly used HP Pavilion',
    description: '16GB RAM, 512 SSD. Battery lasts 4 hours. Serious buyers only.',
    price: 150000,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/hp/400/300',
    timestamp: Date.now()
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Aisha (Law)',
    university: University.ABU,
    title: 'Law Textbooks Bundle',
    description: 'Contract Law, Criminal Law, and Evidence. Good condition.',
    price: 25000,
    category: 'Books',
    image: 'https://picsum.photos/seed/books/400/300',
    timestamp: Date.now()
  },
  {
    id: '3',
    sellerId: 's3',
    sellerName: 'Tobi (Arts)',
    university: University.UI,
    title: 'Custom Denim Jacket',
    description: 'Hand-painted size L. One of a kind design.',
    price: 12000,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/denim/400/300',
    timestamp: Date.now()
  }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [userName, setUserName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setCurrentPage('marketplace');
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setUserName('');
    setCurrentPage('home');
    setChatSessions([]);
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'timestamp'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setProducts([product, ...products]);
    setCurrentPage('marketplace');
  };

  const handleStartChat = (product: Product) => {
    // Check if session exists
    const existingSession = chatSessions.find(s => s.productId === product.id);
    if (existingSession) {
      setCurrentPage('chat');
      return;
    }

    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      productTitle: product.title,
      otherPartyName: product.sellerName, // Assuming we are buyer
      messages: [
        {
          id: 'msg-init',
          sender: 'other',
          text: `Hi! Is this item (${product.title}) still available?`,
          timestamp: Date.now()
        }
      ],
      safetyScore: 100
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentPage('chat');
  };

  const handleSendMessage = (sessionId: string, text: string) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [
            ...session.messages,
            {
              id: Math.random().toString(36).substr(2, 9),
              sender: 'me',
              text: text,
              timestamp: Date.now()
            }
          ]
        };
      }
      return session;
    }));

    // Simulate reply after 2 seconds
    setTimeout(() => {
       setChatSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          // Simple mock responses
          const responses = [
              "Yes, it is available!",
              "Last price?",
              "Can we meet at the faculty?",
              "Okay, deal.",
              "I'm at the gate."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          return {
            ...session,
            messages: [
              ...session.messages,
              {
                id: Math.random().toString(36).substr(2, 9),
                sender: 'other',
                text: randomResponse,
                timestamp: Date.now()
              }
            ]
          };
        }
        return session;
      }));
    }, 2000);
  };

  if (userRole === UserRole.GUEST) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar 
        role={userRole} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
      />
      
      <main>
        {currentPage === 'marketplace' && (
          <ProductList products={products} onChatStart={handleStartChat} />
        )}
        
        {currentPage === 'dashboard' && userRole === UserRole.SELLER && (
          <SellerDashboard sellerName={userName} onAddProduct={handleAddProduct} />
        )}

        {currentPage === 'chat' && (
          <ChatTracker 
            sessions={chatSessions} 
            currentRole={userRole} 
            onSendMessage={handleSendMessage} 
          />
        )}

        {/* Fallback for Dashboard if buyer tries to access via URL/Props manipulation */}
        {currentPage === 'dashboard' && userRole === UserRole.BUYER && (
             <div className="p-10 text-center">
                 <h2 className="text-2xl font-bold">Access Denied</h2>
                 <p>You need a Seller account to view this page.</p>
             </div>
        )}
      </main>
    </div>
  );
};

export default App;