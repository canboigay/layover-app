import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Compliance.css';

const Compliance = () => {
  const navigate = useNavigate();

  return (
    <div className="compliance-container">
      <div className="compliance-header">
        <button onClick={() => navigate('/home')} className="btn-back">← Back</button>
        <h1>FAA COMPLIANCE & GUIDELINES</h1>
        <div className="compliance-badge">EST. 2025</div>
      </div>

      <div className="compliance-content">
        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2>Off-Duty Use Only</h2>
          <p>
            Layover is designed exclusively for use during off-duty hours and rest periods. 
            This application is strictly prohibited during flight operations, duty time, or 
            any period where crew members are under FAA operational regulations (14 CFR Part 117).
          </p>
          <div className="compliance-reference">
            <strong>Reference:</strong> 14 CFR § 117.5 - Fitness for duty
          </div>
        </section>

        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2>Data Privacy & Security</h2>
          <p>
            All data is encrypted in transit using TLS/SSL. Location data is ephemeral and 
            automatically deleted when sessions expire (default 24 hours). No personally 
            identifiable information is stored permanently. Profile photos and session data 
            are deleted after 90 days of inactivity.
          </p>
          <div className="compliance-reference">
            <strong>Reference:</strong> TSA Security Directive 1542-04-21B
          </div>
        </section>

        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h2>Crew Resource Management (CRM)</h2>
          <p>
            Layover promotes crew coordination and communication during rest periods, aligning 
            with CRM principles for improved crew cohesion. The platform facilitates social 
            coordination without interfering with mandatory rest requirements.
          </p>
          <div className="compliance-reference">
            <strong>Reference:</strong> FAA AC 120-51E - Crew Resource Management
          </div>
        </section>

        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2>No Operational Data</h2>
          <p>
            Layover does not store, transmit, or process any operational flight data, crew 
            scheduling information, or airline proprietary information. The app is purely 
            for social coordination during off-duty periods.
          </p>
          <div className="compliance-reference">
            <strong>Reference:</strong> 49 CFR § 1520 - Protection of SSI
          </div>
        </section>

        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2>Rest Period Compliance</h2>
          <p>
            Users are solely responsible for ensuring adequate rest during FAA-mandated rest 
            periods (14 CFR § 117.25). Layover does not monitor, enforce, or interfere with 
            rest requirements. The app should not be used in a manner that disrupts required rest.
          </p>
          <div className="compliance-reference">
            <strong>Reference:</strong> 14 CFR § 117.25 - Rest period requirements
          </div>
        </section>

        <section className="compliance-section">
          <div className="section-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2>User Disclaimer</h2>
          <p>
            By using Layover, crew members acknowledge that this is an independent third-party 
            application not affiliated with, endorsed by, or operated by any airline or the FAA. 
            Users must comply with their airline's social media and communication policies.
          </p>
          <div className="compliance-reference">
            <strong>Last Updated:</strong> December 2025
          </div>
        </section>

        <div className="compliance-footer">
          <p>
            <strong>Important Notice:</strong> Layover is a coordination tool for off-duty flight 
            attendants and crew members. It is not intended for use during duty time, flight operations, 
            or any situation where crew members are subject to FAA operational regulations. Users are 
            responsible for compliance with all applicable FAA regulations, airline policies, and duty 
            time limitations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
