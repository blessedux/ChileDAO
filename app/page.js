export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        ChileDAO
      </h1>
      <p style={{ 
        fontSize: '1.125rem',
        maxWidth: '36rem',
        textAlign: 'center' 
      }}>
        Comunidad web3 desde Chile para el mundo
      </p>
    </div>
  );
}
