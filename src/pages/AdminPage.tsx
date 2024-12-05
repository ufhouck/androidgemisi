import React, { useState } from 'react';
import { PhoneForm } from '../components/admin/PhoneForm';
import { PhoneList } from '../components/admin/PhoneList';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export function AdminPage() {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'phones' | 'reviews'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && <AdminDashboard />}
          {activeSection === 'phones' && (
            <div className="space-y-6">
              <PhoneForm />
              <PhoneList />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}