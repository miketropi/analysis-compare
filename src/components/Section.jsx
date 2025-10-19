export default function Section({ 
  children, 
  className = "", 
  padding = "py-16", 
  maxWidth = "max-w-4xl",
  center = true 
}) {
  const containerClass = center ? "mx-auto" : "";
  
  return (
    <section className={`${padding} ${className}`}>
      <div className={`${maxWidth} ${containerClass} px-6`}>
        {children}
      </div>
    </section>
  );
}
