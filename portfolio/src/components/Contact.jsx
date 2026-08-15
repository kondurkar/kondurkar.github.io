import { useForm, ValidationError } from "@formspree/react";
import { ME, FORMSPREE_ID } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function InputField({ label, id, type = "text", name, placeholder, errors }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[12px] text-slate-400 tracking-[0.08em]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="bg-[#141c26] border border-cyan-500/10 rounded-sm px-4 py-3 text-[14px]
                   text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                   focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
      />
      {errors && (
        <ValidationError
          prefix={label}
          field={name}
          errors={errors}
          className="text-red-400 text-[12px] font-mono"
        />
      )}
    </div>
  );
}

function ContactForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_ID);

  if (state.succeeded) {
    return (
      <div className="text-center py-16">
        <span className="block w-2.5 h-2.5 rounded-full bg-emerald-400 mx-auto mb-4 animate-pulse" />
        <p className="font-mono text-[13px] text-emerald-400 tracking-[0.2em]">MESSAGE_SENT</p>
        <p className="text-slate-400 text-[14px] mt-2">I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="name"  id="name"  name="name"  placeholder="Jane Smith"       errors={state.errors} />
        <InputField label="email" id="email" name="email" placeholder="jane@company.com" type="email" errors={state.errors} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="font-mono text-[12px] text-slate-400 tracking-[0.08em]">
          subject
        </label>
        <input
          id="subject"
          type="text"
          name="subject"
          placeholder="Project inquiry, collaboration, etc."
          className="bg-[#141c26] border border-cyan-500/10 rounded-sm px-4 py-3 text-[14px]
                     text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                     focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-mono text-[12px] text-slate-400 tracking-[0.08em]">
          message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell me about what you're building..."
          className="bg-[#141c26] border border-cyan-500/10 rounded-sm px-4 py-3 text-[14px]
                     text-slate-200 placeholder-slate-600 outline-none transition-all duration-200
                     focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 resize-none"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors}
          className="text-red-400 text-[12px] font-mono" />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="self-start flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black
                   font-mono text-[13px] tracking-widest px-7 py-3 rounded-sm transition-all duration-200
                   hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,200,255,0.4)]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {state.submitting ? "SENDING..." : "Send Message →"}
      </button>

      {FORMSPREE_ID === "YOUR_FORM_ID" && (
        <p className="font-mono text-[11px] text-amber-400 mt-1">
          ⚠ Replace FORMSPREE_ID in src/data/config.js to enable form submissions.
        </p>
      )}
    </form>
  );
}

export default function Contact() {
  const titleRef  = useFadeUp();
  const subRef    = useFadeUp();
  const socialRef = useFadeUp();

  const SOCIALS = [
    { label: "Email",    icon: EmailIcon,    href: `mailto:${ME.email}` },
    { label: "GitHub",   icon: GitHubIcon,   href: ME.social.github   },
    { label: "LinkedIn", icon: LinkedInIcon, href: ME.social.linkedin },
  ];

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-[#0d1117] border-t border-b border-cyan-500/10 py-24 px-8"
    >
      <div className="max-w-[700px] mx-auto text-center">
        <div className="flex justify-center">
          <SectionLabel index="05" label="contact" />
        </div>

        <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-4">
          Let's Build Something
        </h2>
        <p ref={subRef} className="fade-up text-slate-400 text-[15px]">
          Have a project in mind or just want to say hi? My inbox is always open.
        </p>

        {/* <ContactForm /> */}

        {/* Socials */}
        <div ref={socialRef} className="fade-up flex justify-center flex-wrap gap-3 mt-8">
          {SOCIALS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[13px] text-slate-400 no-underline
                         px-5 py-2.5 border border-cyan-500/10 rounded-sm transition-all duration-200
                         hover:text-cyan-400 hover:border-cyan-500/25 hover:bg-cyan-500/4"
            >
              <Icon style={{ fontSize: "16px" }} /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
