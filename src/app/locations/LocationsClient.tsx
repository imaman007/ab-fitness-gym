'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Star, Clock, Search, Wifi } from 'lucide-react'

interface Location {
  id: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  rating: number
  timings: string
  amenities: string[]
}

export default function LocationsClient({ locations }: { locations: Location[] }) {
  const [search, setSearch] = useState('')

  const filtered = locations.filter(
    l =>
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.state.toLowerCase().includes(search.toLowerCase()) ||
      l.name.toLowerCase().includes(search.toLowerCase())
  )

  const cities = [...new Set(locations.map(l => l.city))].sort()

  return (
    <div>
      {/* Search */}
      <div style={{ maxWidth: 480, margin: '0 auto 48px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          className="form-input"
          style={{ paddingLeft: 46, fontSize: '1rem', padding: '14px 16px 14px 46px' }}
          placeholder="Search by city or state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="location-search"
        />
      </div>

      {/* City Pills */}
      {!search && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 48 }}>
          {cities.map(city => (
            <button
              key={city}
              className="btn btn-secondary btn-sm"
              onClick={() => setSearch(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>
        Showing {filtered.length} location{filtered.length !== 1 ? 's' : ''}
        {search ? ` for "${search}"` : ''}
      </p>

      <div className="grid-3">
        {filtered.map(loc => (
          <div key={loc.id} className="card location-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 4 }}>{loc.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <MapPin size={12} /> {loc.city}, {loc.state}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                <Star size={13} fill="currentColor" /> {loc.rating}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {loc.address}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              <Clock size={12} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
              <span>{loc.timings}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              <Phone size={12} style={{ color: 'var(--accent-light)', flexShrink: 0 }} />
              <span>{loc.phone}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              <Mail size={12} style={{ color: 'var(--accent-light)', flexShrink: 0 }} />
              <span>{loc.email}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {loc.amenities.map(a => (
                <span key={a} className="badge badge-accent" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <MapPin size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No locations found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try a different city or state name.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={() => setSearch('')}>Clear Search</button>
        </div>
      )}

      <style>{`
        .location-card:hover { border-color: rgba(124, 58, 237, 0.4); }
      `}</style>
    </div>
  )
}
