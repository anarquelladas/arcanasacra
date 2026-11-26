import { useState } from 'react';
import { WaxSeal } from './engravings/Objects';
import { playSound } from '../lib/sound';
import './letter.css';

// Un sobre lacrado: al romper el lacre se abre la solapa y sale la carta con los datos de contacto.

interface Props {
  email: string;
  github: string;
  instagram?: string;
  linkedin?: string;
}

export default function Letter({ email, github, instagram, linkedin }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      playSound('tick');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${email}`;
    }
  };

  const openLetter = () => {
    playSound('seal-break');
    setOpen(true);
    setTimeout(() => playSound('envelope-open'), 150);
    setTimeout(() => playSound('paper'), 1200);
  };
  const closeLetter = () => {
    playSound('paper');
    setOpen(false);
  };

  return (
    <div className={`post ${open ? 'open' : ''}`}>
      <p className="hint" aria-hidden={open}>break the seal</p>
      <div className="env">
        <div className="env-back" />
        <div className="letter" aria-hidden={!open}>
          <p className="dear">Dear visitor,</p>
          <p className="lead">For commissions, bookings or a job offer, this is where to find me.</p>
          <dl>
            <dt>email</dt>
            <dd>
              <a href={`mailto:${email}`} tabIndex={open ? 0 : -1}>{email}</a>
              <button className="copy" onClick={copy} tabIndex={open ? 0 : -1}>{copied ? 'copied ✓' : 'copy'}</button>
            </dd>
            <dt>github</dt>
            <dd><a href={`https://github.com/${github}`} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>@{github}</a></dd>
            {instagram && (<><dt>instagram</dt><dd><a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>@{instagram}</a></dd></>)}
            {linkedin && (<><dt>linkedin</dt><dd><a href={linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>profile ↗</a></dd></>)}
          </dl>
          <p className="ps">P.S. If it's a tattoo, tell me the idea, the placement, the rough size and whether you want it black or in colour.</p>
        </div>
        <svg className="env-front" viewBox="0 0 260 170" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0L130,100 260,0V170H0Z" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth=".8" />
          <path d="M0,170L112,92M260,170L148,92" stroke="var(--ink-dark)" strokeWidth=".8" fill="none" />
          <path d="M0,170L112,92 148,92 260,170Z" fill="url(#h-k)" opacity=".15" />
        </svg>
        <svg className="env-flap" viewBox="0 0 260 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0L130,112 260,0Z" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth=".8" />
          <path d="M0,0L130,112 260,0 248,0 130,102 12,0Z" fill="url(#hh-k)" opacity=".18" />
        </svg>
        <button className="seal-btn" onClick={openLetter} disabled={open} aria-label="Break the seal and open the letter">
          <svg className="half l" viewBox="0 0 60 60"><WaxSeal cx={30} cy={30} r={26} /></svg>
          <svg className="half r" viewBox="0 0 60 60"><WaxSeal cx={30} cy={30} r={26} /></svg>
        </button>
      </div>
      {open && (
        <button className="reseal" onClick={closeLetter}>seal it again</button>
      )}
    </div>
  );
}
