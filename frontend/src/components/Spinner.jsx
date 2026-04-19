export default function Spinner({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <i className="bi bi-exclamation-circle" style={{ fontSize: 32, color: '#ff7b72', display: 'block', marginBottom: 12 }} />
      <p style={{ color: '#ff7b72', marginBottom: 16 }}>{message}</p>
      {onRetry && (
        <button className="btn-outline-custom" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise" /> Retry
        </button>
      )}
    </div>
  );
}
