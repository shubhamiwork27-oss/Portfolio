import { useEffect, useRef, useState, memo } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Code2,
  BriefcaseBusiness,
} from "lucide-react";

import "./Contact.css";
import SplitFlapText from "./SplitFlapText";

// Keep these two addresses intentional.
// PUBLIC_EMAIL appears on the contact card.
// FORM_RECIPIENT_EMAIL receives the contact form submissions.
const PUBLIC_EMAIL = "Shubhamiwork27@gmail.com";
const FORM_RECIPIENT_EMAIL = "shubhamiwork27@gmail.com";

const MAX_MESSAGE_LENGTH = 500;

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactComponent() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Update a field and clear its previous error.
  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      if (!previous[field]) return previous;

      const updated = { ...previous };
      delete updated[field];
      return updated;
    });

    // Allow another submission after editing a successful form.
    setStatus("idle");
    setErrorMessage("");
  };

  // Validate the form before sending.
  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please write a short message.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Copy email with a fallback for browsers without Clipboard API access.
  const handleCopyEmail = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(PUBLIC_EMAIL);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = PUBLIC_EMAIL;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        textArea.style.pointerEvents = "none";

        document.body.appendChild(textArea);
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Clipboard copy failed.");
        }
      }

      setCopied(true);
      setCopyError(false);
    } catch (error) {
      console.error("Unable to copy email:", error);
      setCopied(false);
      setCopyError(true);
    }

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 2400);
  };

  // Generate a mailto fallback if automatic delivery fails.
  const getMailtoUrl = () => {
    const subject =
      formData.subject.trim() ||
      `Portfolio message from ${formData.name.trim()}`;

    const body = [
      `Hi Shubham,`,
      "",
      formData.message.trim(),
      "",
      "---",
      `From: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
    ].join("\n");

    return (
      `mailto:${FORM_RECIPIENT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
    );
  };

  // Submit the form through FormSubmit.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "loading") return;
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${FORM_RECIPIENT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            _replyto: formData.email.trim(),
            subject:
              formData.subject.trim() ||
              "New Portfolio Contact Message",
            message: formData.message.trim(),
            _subject: `Portfolio message from ${formData.name.trim()}`,
            _template: "table",
          }),
        }
      );

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The email service returned an unexpected response. Please try again."
        );
      }

      const requestSucceeded =
        response.ok &&
        (result.success === true || result.success === "true");

      if (!requestSucceeded) {
        throw new Error(
          result.message || "Your message could not be submitted."
        );
      }

      setStatus("success");
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      console.error("Contact form submission failed:", error);

      setStatus("error");
      setErrorMessage(
        error.message ||
          "Unable to send your message right now. Please use the email option below."
      );
    }
  };

  const fieldClass = (field) =>
    `dock-glass-input w-full px-5 py-3.5 rounded-2xl
    placeholder:text-white/60 text-base font-medium
    transition-all duration-200
    focus:outline-none focus:ring-1 focus:ring-white/40
    ${
      errors[field]
        ? "dock-glass-input-error"
        : ""
    }`;

  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 sm:px-8 md:px-10
      py-8 sm:py-10 flex flex-col justify-center text-white"
      aria-label="Contact Shubham"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="lg:col-span-5 flex flex-col items-start justify-center gap-5 sm:gap-6 min-w-0"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md text-xs text-white/90 shadow-sm">
            <Sparkles size={13} className="text-white/80" />

            <span className="tracking-widest uppercase font-semibold text-[11px]">
              Connect with me
            </span>
          </div>

          {/* Animated headline */}
          <div className="w-full min-w-0 overflow-hidden">
            <div
              className="origin-left scale-[0.78] sm:scale-90 md:scale-100"
              role="heading"
              aria-level={1}
              aria-label="Get in touch"
            >
              <SplitFlapText
                words={[
                  "GET IN TOUCH",
                  "LET'S BUILD",
                  "START IDEAS",
                  "LET'S CONNECT",
                ]}
                fontSize={35}
                tileRadius={5}
                gap={4}
                padTo={12}
                tileColor="#4a4a4a"
                textColor="white"
                cycleDelay={3500}
              />
            </div>
          </div>

          {/* Introduction */}
          <p className="text-2xl sm:text-base text-white/75 leading-relaxed max-w-xl">
            Have a project in mind, an opportunity, or an idea
            worth exploring? I enjoy building thoughtful digital
            experiences, experimenting with creative frontend
            interactions, and turning ideas into useful products.
            Let&apos;s connect and build something meaningful.
          </p>

          {/* Availability */}
          <div className="flex items-center gap-2.5 px-1">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-.5 w-3.5 bg-white" />
            </span>

            <span className="text-xs sm:text-sm font-medium tracking-wide text-white/85">
              Open to internships, collaborations &amp; opportunities.
            </span>
          </div>

          {/* Email card */}
          <div className="dock-glass-input flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-2xl w-full min-w-0 transition-transform duration-200 hover:scale-[1.01]">
            <a
              href={`mailto:${PUBLIC_EMAIL}`}
              className="flex items-center gap-2.5 text-white/95 hover:text-white font-medium text-sm sm:text-base min-w-0 transition-colors"
              title="Compose an email"
            >
              <Mail
                size={17}
                className="text-white/80 shrink-0"
              />

              <span className="truncate tracking-wide">
                {PUBLIC_EMAIL}
              </span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              bg-white/[0.12] hover:bg-white/[0.22]
              active:scale-95 text-xs text-white font-medium
              transition-all cursor-pointer shrink-0 border border-white/15"
              title="Copy email address"
              aria-label="Copy email address"
            >
              {copied ? (
                <>
                  <Check
                    size={13}
                    className="text-white"
                  />
                  <span className="text-white font-semibold">
                    Copied!
                  </span>
                </>
              ) : copyError ? (
                <>
                  <AlertCircle size={13} />
                  <span>Failed</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Small information details */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex items-start gap-3">
              <MapPin
                size={17}
                className="mt-0.5 text-white/60 shrink-0"
              />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Based in
                </p>
                <p className="mt-1 text-sm text-white/85">
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BriefcaseBusiness
                size={17}
                className="mt-0.5 text-white/60 shrink-0"
              />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Interested in
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/85">
                  Internships, frontend &amp; full-stack projects
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Code2
                size={17}
                className="mt-0.5 text-white/60 shrink-0"
              />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">
                  `Current focus
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Creative interfaces and useful web applications
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="lg:col-span-7 w-full min-w-0 flex flex-col justify-center"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 w-full"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="block text-xs font-semibold tracking-wider text-white/70 uppercase px-1"
              >
                Name
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
                className={fieldClass("name")}
              />

              {errors.name && (
                <p
                  id="contact-name-error"
                  className="text-xs text-red-300 font-medium px-2"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="block text-xs font-semibold tracking-wider text-white/70 uppercase px-1"
              >
                Email
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) =>
                  handleChange("email", event.target.value)
                }
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={fieldClass("email")}
              />

              {errors.email && (
                <p
                  id="contact-email-error"
                  className="text-xs text-red-300 font-medium px-2"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Optional subject */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold tracking-wider text-white/70 uppercase"
                >
                  Subject
                </label>

                <span className="text-[11px] text-white/40 tracking-wider">
                  OPTIONAL
                </span>
              </div>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                maxLength={120}
                placeholder="What would you like to discuss?"
                value={formData.subject}
                onChange={(event) =>
                  handleChange("subject", event.target.value)
                }
                className="dock-glass-input w-full px-5 py-3.5 rounded-2xl placeholder:text-white/60 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold tracking-wider text-white/70 uppercase"
                >
                  Message
                </label>

                <span
                  className={`text-[11px] font-mono tracking-wider ${
                    formData.message.length >= MAX_MESSAGE_LENGTH
                      ? "text-red-300"
                      : "text-white/50"
                  }`}
                  aria-live="polite"
                >
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>

              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH}
                placeholder="Tell me a little about your idea..."
                value={formData.message}
                onChange={(event) =>
                  handleChange("message", event.target.value)
                }
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message
                    ? "contact-message-error"
                    : undefined
                }
                className={`dock-glass-input w-full px-5 py-4 rounded-3xl
                  placeholder:text-white/60 text-base font-medium
                  resize-none min-h-[120px] sm:min-h-[140px]
                  transition-all duration-200
                  focus:outline-none focus:ring-1 focus:ring-white/40
                  ${
                    errors.message
                      ? "dock-glass-input-error"
                      : ""
                  }`}
              />

              {errors.message && (
                <p
                  id="contact-message-error"
                  className="text-xs text-red-300 font-medium px-2"
                  role="alert"
                >
                  {errors.message}
                </p>
              )}
            </div>

            {/* Success feedback */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/20 text-white/90 text-xs sm:text-sm flex items-center gap-2.5"
              >
                <Check
                  size={18}
                  className="text-white shrink-0"
                />

                <span>
                  Your message was submitted successfully. Thank
                  you for reaching out!
                </span>
              </motion.div>
            )}

            {/* Error feedback and email fallback */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="p-3.5 rounded-2xl bg-red-500/[0.10] border border-red-400/30 text-red-100 text-xs sm:text-sm space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={17}
                    className="text-red-300 shrink-0 mt-0.5"
                  />

                  <span>{errorMessage}</span>
                </div>

                <a
                  href={getMailtoUrl()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.12] hover:bg-white/[0.22] text-white font-medium text-xs transition-colors"
                >
                  <span>Send using your email app</span>
                  <ExternalLink size={12} />
                </a>
              </motion.div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="dock-glass-button group inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-white font-semibold text-sm sm:text-base cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {status === "loading" ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin text-white/80"
                    />
                    <span>Sending...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <Check
                      size={16}
                      className="text-white"
                    />
                    <span>Submitted</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send
                      size={15}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(ContactComponent);