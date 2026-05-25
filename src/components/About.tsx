// rsschool-cv\src\components\About.tsx
const About = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>      
      <h1 className="about-title">О приложении</h1>
      <p>Это учебный проект курса RS School React.</p>
      <p>Автор: KnajZ11</p>
      <a href="https://rs.school" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
        Курс RS School React
      </a>
    </div>
  );
};

export default About;