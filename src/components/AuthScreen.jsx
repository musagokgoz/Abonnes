import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Eye, EyeOff, KeyRound, Lock, LogIn, Mail, UserPlus } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import AbonnesLogo from './AbonnesLogo';

const PASSWORD_RULES = [
  { id: 'length', label: 'En az 8 karakter', test: (value) => value.length >= 8 },
  { id: 'uppercase', label: 'Bir büyük harf', test: (value) => /[A-ZÇĞİÖŞÜ]/.test(value) },
  { id: 'number', label: 'Bir rakam', test: (value) => /\d/.test(value) },
];

const getRedirectUrl = () => window.location.origin + window.location.pathname;

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = useMemo(() => PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(password) })), [password]);
  const isPasswordStrong = passwordChecks.every((rule) => rule.valid);
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage(null);
    setPassword('');
    setConfirmation('');
  };

  const handleGoogleSignIn = async () => {
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: getRedirectUrl() } });
    if (error) setMessage({ type: 'error', text: error.message });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (isSignup && !isPasswordStrong) {
      setMessage({ type: 'error', text: 'Şifreniz tüm güvenlik kurallarını karşılamıyor.' });
      return;
    }
    if (isSignup && password !== confirmation) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' });
      return;
    }

    setIsSubmitting(true);
    let result;
    try {
      if (isForgot) result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: getRedirectUrl() });
      else if (isSignup) result = await supabase.auth.signUp({ email, password });
      else result = await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      setIsSubmitting(false);
      setMessage({ type: 'error', text: error.message || 'Bağlantı kurulamadı.' });
      return;
    }
    setIsSubmitting(false);

    if (result.error) {
      const messages = {
        'Invalid login credentials': 'E-posta veya şifre hatalı.',
        'Email not confirmed': 'E-posta adresinizi doğrulamanız gerekiyor.',
        'User already registered': 'Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.',
      };
      setMessage({ type: 'error', text: messages[result.error.message] || result.error.message });
      return;
    }
    if (isForgot) setMessage({ type: 'success', text: 'Şifre yenileme bağlantısı e-posta adresinize gönderildi.' });
    else if (isSignup && !result.data.session) setMessage({ type: 'success', text: 'Kayıt başarılı. E-posta adresinizi doğrulayıp giriş yapın.' });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.1),_transparent_36%)]" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-5"><AbonnesLogo className="w-11 h-11" size={28} /><span className="text-sm font-black tracking-wide text-white">ABONNES</span></div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">{isForgot ? 'Hesap kurtarma' : isSignup ? 'Yeni hesap' : 'Hoş geldin'}</p>
          <h1 className="text-2xl font-black text-white">{isForgot ? 'Şifreni yenile' : isSignup ? 'Hesabını oluştur' : 'Aboneliklerini takip et'}</h1>
          <p className="text-sm text-slate-400 mt-2">{isForgot ? 'Şifre yenileme bağlantısını e-posta adresine gönderelim.' : 'Verilerine telefon ve web üzerinden güvenle eriş.'}</p>
        </div>

        {message && <div className={`mb-4 rounded-2xl border px-3 py-3 text-xs flex gap-2 items-start ${message.type === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>{message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}<span>{message.text}</span></div>}

        {!isForgot && <><button type="button" onClick={handleGoogleSignIn} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-white py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"><span className="w-7 h-7 rounded-full bg-[conic-gradient(from_-35deg,_#4285f4_0deg_92deg,_#34a853_92deg_178deg,_#fbbc05_178deg_244deg,_#ea4335_244deg_325deg,_#4285f4_325deg_360deg)] p-1 flex items-center justify-center" aria-hidden="true"><span className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-black text-[#4285F4]">G</span></span>Google ile devam et</button><div className="flex items-center gap-3 my-5"><div className="h-px bg-slate-800 flex-1" /><span className="text-[10px] uppercase tracking-widest text-slate-500">veya e-posta ile</span><div className="h-px bg-slate-800 flex-1" /></div></>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block"><span className="block text-xs font-semibold text-slate-400 mb-1.5">E-posta</span><span className="relative block"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-10 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="ornek@mail.com" /></span></label>
          {!isForgot && <label className="block"><span className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5"><span>Şifre</span>{mode === 'login' && <button type="button" onClick={() => changeMode('forgot')} className="text-emerald-400 hover:text-emerald-300">Şifremi unuttum</button>}</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type={showPassword ? 'text' : 'password'} required minLength={isSignup ? 8 : 6} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-10 pr-11 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder={isSignup ? 'Güçlü bir şifre oluştur' : 'Şifren'} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Şifreyi göster">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>}
          {isSignup && <><div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">{passwordChecks.map((rule) => <div key={rule.id} className={`flex items-center gap-2 text-xs ${rule.valid ? 'text-emerald-300' : 'text-slate-500'}`}>{rule.valid ? <Check className="w-3.5 h-3.5" /> : <KeyRound className="w-3.5 h-3.5" />}<span>{rule.label}</span></div>)}</div><label className="block"><span className="block text-xs font-semibold text-slate-400 mb-1.5">Şifre tekrarı</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type={showConfirmation ? 'text' : 'password'} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-10 pr-11 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="Şifreni tekrar yaz" /><button type="button" onClick={() => setShowConfirmation(!showConfirmation)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Tekrarlanan şifreyi göster">{showConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label></>}
          <button type="submit" disabled={isSubmitting || (isSignup && !isPasswordStrong)} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">{isForgot ? <Mail className="w-4 h-4" /> : mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}{isSubmitting ? 'İşleniyor...' : isForgot ? 'Bağlantı Gönder' : mode === 'login' ? 'Giriş Yap' : 'Güvenli Kayıt Ol'}</button>
        </form>

        <button type="button" onClick={() => changeMode(isForgot ? 'login' : mode === 'login' ? 'signup' : 'login')} className="w-full mt-5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">{isForgot && <ArrowLeft className="w-3.5 h-3.5" />}{isForgot ? 'Giriş ekranına dön' : mode === 'login' ? 'Henüz hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}</button>
      </section>
    </main>
  );
}
