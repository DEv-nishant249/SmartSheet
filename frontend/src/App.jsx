import { useState } from "react";
import axios from "axios";
import {
  Mic,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [recording, setRecording] = useState(false);

  const backend = "https://backend-xfja.onrender.com";

  const generateFromText = async () => {
    try {
      const response = await axios.post(
        `${backend}/text-to-excel`,
        { text }
      );

      setDownloadUrl(
        `${backend}/download/${response.data.filename}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const generateFromImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${backend}/image-to-excel`,
        formData
      );

      setDownloadUrl(
        `${backend}/download/${response.data.filename}`
      );

      setOcrText(response.data.ocr_text);
    } catch (error) {
      console.log(error);
    }
  };

  const startVoice = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";

    setRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setText((prev) => prev + "\n" + transcript);

      setRecording(false);
    };

    recognition.onerror = () => {
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <>
      <style>
        {`
        
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family:Inter, sans-serif;
          background:#050816;
          overflow-x:hidden;
        }

        ::-webkit-scrollbar{
          width:10px;
        }

        ::-webkit-scrollbar-track{
          background:#020617;
        }

        ::-webkit-scrollbar-thumb{
          background:linear-gradient(#06b6d4,#8b5cf6);
          border-radius:20px;
        }

        @keyframes float {
          0%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(-18px);
          }

          100%{
            transform:translateY(0px);
          }
        }

        @keyframes glow {
          0%{
            opacity:0.4;
          }

          50%{
            opacity:0.8;
          }

          100%{
            opacity:0.4;
          }
        }

        @keyframes borderGlow {
          0%{
            border-color:rgba(255,255,255,0.08);
          }

          50%{
            border-color:rgba(139,92,246,0.5);
          }

          100%{
            border-color:rgba(255,255,255,0.08);
          }
        }

        .heroSection{
          display:grid;
          grid-template-columns:1.1fr 0.9fr;
          gap:90px;
          align-items:center;
        }

        .bottomGrid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:32px;
          margin-top:90px;
        }

        .glassCard{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(28px);
          box-shadow:0 25px 80px rgba(0,0,0,0.45);
        }

        .primaryButton{
          background:linear-gradient(135deg,#06b6d4,#2563eb);
          border:none;
          color:white;
          font-weight:700;
          cursor:pointer;
          transition:0.35s;
        }

        .primaryButton:hover{
          transform:translateY(-3px);
          box-shadow:0 15px 40px rgba(37,99,235,0.4);
        }

        .secondaryButton{
          transition:0.35s;
        }

        .secondaryButton:hover{
          transform:translateY(-3px);
          background:rgba(255,255,255,0.08) !important;
        }

        .uploadArea{
          transition:0.4s;
        }

        .uploadArea:hover{
          border-color:#8b5cf6 !important;
          background:rgba(255,255,255,0.04) !important;
        }

        textarea:focus{
          border-color:#22d3ee !important;
          box-shadow:0 0 0 4px rgba(34,211,238,0.08);
        }

        @media(max-width:1200px){

          .heroSection{
            grid-template-columns:1fr;
          }

          .bottomGrid{
            grid-template-columns:1fr;
          }

        }

        @media(max-width:768px){

          .mainContainer{
            padding:24px 18px !important;
          }

          .navbar{
            flex-direction:column;
            align-items:flex-start !important;
            gap:24px;
          }

          .heroTitle{
            font-size:54px !important;
            line-height:58px !important;
          }

          .heroDesc{
            font-size:17px !important;
            line-height:30px !important;
          }

          .heroCard{
            padding:24px !important;
          }

          .actionButtons{
            flex-direction:column;
          }

          .voiceButton{
            width:100% !important;
            height:65px;
          }

          .featureWrap{
            gap:12px !important;
          }

          .featureBadge{
            width:100%;
            justify-content:center;
          }

          .ocrPreview{
            height:340px !important;
          }

        }

        @media(max-width:520px){

          .heroTitle{
            font-size:42px !important;
            line-height:48px !important;
            letter-spacing:-2px !important;
          }

          .downloadButton{
            right:18px !important;
            left:18px !important;
            justify-content:center;
          }

        }

      `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left,#172554 0%,#050816 40%,#020617 100%)",
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
      >
        {/* GLOW BACKGROUND */}

        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#06b6d4,#8b5cf6)",
            filter: "blur(180px)",
            opacity: 0.18,
            top: "-180px",
            left: "-100px",
            animation: "glow 6s infinite ease-in-out",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#9333ea,#2563eb)",
            filter: "blur(180px)",
            opacity: 0.18,
            bottom: "-180px",
            right: "-100px",
            animation: "glow 8s infinite ease-in-out",
          }}
        />

        {/* GRID */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div
          className="mainContainer"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "40px 32px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* NAVBAR */}

          <div
            className="navbar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg,#06b6d4,#8b5cf6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow:
                    "0 0 50px rgba(99,102,241,0.45)",
                  animation:
                    "float 5s infinite ease-in-out",
                }}
              >
                <FileSpreadsheet size={32} />
              </div>

              <div>
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    letterSpacing: "-1px",
                  }}
                >
                  SmartSheet
                </h1>

                <p
                  style={{
                    color: "#94a3b8",
                    marginTop: "6px",
                    fontSize: "14px",
                    letterSpacing: "1px",
                  }}
                >
                  AI SPREADSHEET PLATFORM
                </p>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                padding: "10px 18px",
                borderRadius: "999px",
                fontSize: "13px",
                color: "#94a3b8",
                letterSpacing: "1px",
              }}
            >
              Developed By Developer Nishant
            </div>
          </div>

          {/* HERO */}

          <div className="heroSection">
            {/* LEFT */}

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  background:
                    "rgba(255,255,255,0.05)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  padding: "14px 24px",
                  borderRadius: "999px",
                  backdropFilter: "blur(25px)",
                  marginBottom: "36px",
                }}
              >
                <Sparkles
                  size={16}
                  color="#22d3ee"
                />

                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                   AUTOMATION PLATFORM
                </span>
              </div>

              <h1
                className="heroTitle"
                style={{
                  fontSize: "84px",
                  lineHeight: "88px",
                  fontWeight: 900,
                  letterSpacing: "-4px",
                  marginBottom: "34px",
                }}
              >
                Convert
                <span
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(90deg,#22d3ee,#8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  Anything
                </span>

                Into Excel.
              </h1>

              <p
                className="heroDesc"
                style={{
                  color: "#94a3b8",
                  fontSize: "20px",
                  lineHeight: "38px",
                  maxWidth: "650px",
                  marginBottom: "52px",
                }}
              >
                Transform screenshots, OCR data,
                invoices, voice notes, and raw text
                into premium structured Excel sheets
                using intelligent automation.
              </p>

              {/* FEATURES */}

              <div
                className="featureWrap"
                style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  marginBottom: "52px",
                }}
              >
                {[
                  "Voice → Excel",
                  "OCR → Excel",
                  "Text → Excel",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="featureBadge"
                    style={{
                      background:
                        "rgba(255,255,255,0.05)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      padding: "18px 24px",
                      borderRadius: "22px",
                      backdropFilter: "blur(20px)",
                      color: "#cbd5e1",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <button
                className="primaryButton"
                style={{
                  padding: "20px 34px",
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "17px",
                }}
              >
                Start Generating

                <ArrowRight size={20} />
              </button>
            </div>

            {/* RIGHT */}

            <div
              className="glassCard heroCard"
              style={{
                borderRadius: "40px",
                padding: "36px",
                animation:
                  "borderGlow 5s infinite ease-in-out",
              }}
            >
              {/* DOTS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />

                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                />

                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </div>

              {/* TEXTAREA */}

              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder="Rahul, 9876543210, Delhi"
                style={{
                  width: "100%",
                  height: "260px",
                  background:
                    "rgba(0,0,0,0.25)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "30px",
                  padding: "24px",
                  color: "white",
                  fontSize: "18px",
                  resize: "none",
                  outline: "none",
                  lineHeight: "32px",
                  transition: "0.3s",
                }}
              />

              {/* BUTTONS */}

              <div
                className="actionButtons"
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                <button
                  onClick={generateFromText}
                  className="primaryButton"
                  style={{
                    flex: 1,
                    padding: "18px",
                    borderRadius: "22px",
                    fontSize: "16px",
                  }}
                >
                  Generate Excel
                </button>

                <button
                  onClick={startVoice}
                  className="voiceButton secondaryButton"
                  style={{
                    width: "72px",
                    borderRadius: "22px",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: recording
                      ? "#ef4444"
                      : "rgba(255,255,255,0.05)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <Mic />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}

          <div className="bottomGrid">
            {/* OCR CARD */}

            <div
              className="glassCard"
              style={{
                borderRadius: "36px",
                padding: "34px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "34px",
                }}
              >
                <div
                  style={{
                    width: "74px",
                    height: "74px",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(135deg,#8b5cf6,#6366f1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "0 0 35px rgba(139,92,246,0.35)",
                  }}
                >
                  <UploadCloud size={34} />
                </div>

                <div>
                  <h2
                    style={{
                      fontSize: "32px",
                      fontWeight: 800,
                    }}
                  >
                    Screenshot OCR
                  </h2>

                  <p
                    style={{
                      color: "#94a3b8",
                      marginTop: "8px",
                    }}
                  >
                    Extract spreadsheet data from
                    screenshots
                  </p>
                </div>
              </div>

              {/* DROPZONE */}

              <label
                className="uploadArea"
                style={{
                  height: "320px",
                  border:
                    "2px dashed rgba(255,255,255,0.12)",
                  borderRadius: "32px",
                  background:
                    "rgba(255,255,255,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <UploadCloud
                  size={56}
                  color="#8b5cf6"
                />

                <h3
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    marginTop: "24px",
                    marginBottom: "12px",
                  }}
                >
                  Drop Screenshot Here
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    maxWidth: "420px",
                    lineHeight: "30px",
                  }}
                >
                  Upload invoices, reports,
                  receipts, or screenshots and
                  convert them into structured
                  Excel sheets instantly.
                </p>

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                />
              </label>

              <button
                onClick={generateFromImage}
                className="primaryButton"
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "18px",
                  borderRadius: "22px",
                  background:
                    "linear-gradient(135deg,#8b5cf6,#d946ef)",
                  fontSize: "17px",
                }}
              >
                Upload & Generate
              </button>
            </div>

            {/* OCR PREVIEW */}

            <div
              className="glassCard"
              style={{
                borderRadius: "36px",
                padding: "34px",
              }}
            >
              <div
                style={{
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                  }}
                >
                  OCR Preview
                </h2>

                <p
                  style={{
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  AI extracted text preview output
                </p>
              </div>

              <div
                className="ocrPreview"
                style={{
                  height: "430px",
                  background:
                    "rgba(0,0,0,0.25)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "30px",
                  padding: "24px",
                  overflowY: "auto",
                  color: "#e2e8f0",
                  lineHeight: "30px",
                  fontSize: "16px",
                }}
              >
                {ocrText ? (
                  ocrText
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#64748b",
                      fontSize: "18px",
                    }}
                  >
                    OCR extracted text will appear
                    here...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DOWNLOAD */}

          {downloadUrl && (
            <div
              className="downloadButton"
              style={{
                position: "fixed",
                right: "30px",
                bottom: "30px",
                zIndex: 100,
              }}
            >
              <a
                href={downloadUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background:
                    "linear-gradient(135deg,#facc15,#f97316)",
                  color: "black",
                  padding: "18px 30px",
                  borderRadius: "24px",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow:
                    "0 0 45px rgba(251,191,36,0.35)",
                }}
              >
                <Download size={22} />
                Download Excel
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;