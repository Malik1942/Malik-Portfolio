import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Resume = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const pdfPath = "/Malik_Zhang_Resume_2026.pdf";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border/40 bg-background z-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm text-mono flex items-center gap-2"
        >
          ← Back
        </button>

        <a
          href={pdfPath}
          download="Malik_Zhang_Resume_2026.pdf"
          className="flex items-center gap-2 px-4 py-2 text-sm text-mono text-foreground/80 hover:text-foreground border border-border/50 hover:border-border rounded-sm transition-colors duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download
        </a>
      </div>

      {/* PDF viewer — iframe on desktop, fallback on mobile */}
      {isMobile ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
          <p className="text-muted-foreground/60 text-sm text-body leading-relaxed max-w-[280px]">
            PDF previews aren't supported on mobile browsers. Open or download the resume below.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[240px]">
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm text-mono text-foreground/85 hover:text-foreground border border-border/60 hover:border-border rounded-sm transition-colors duration-300"
            >
              View PDF
            </a>
            <a
              href={pdfPath}
              download="Malik_Zhang_Resume_2026.pdf"
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm text-mono text-foreground/60 hover:text-foreground/85 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <iframe
            src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full"
            style={{ minHeight: "calc(100vh - 57px)" }}
            title="Malik Zhang Resume"
          />
        </div>
      )}
    </div>
  );
};

export default Resume;
