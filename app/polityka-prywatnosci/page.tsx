import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Arrow from '@/components/Arrow';
import Link from 'next/link';

export const metadata = {
  title: 'Polityka prywatności — Dom w Mesznej',
  description: 'Informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="pt-32 md:pt-44 pb-24 md:pb-32">
        <article className="mx-auto max-w-3xl px-6 md:px-10">
          <div className="label-mono opacity-60 mb-6">Dokument prawny</div>
          <h1
            className="display-serif mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
          >
            Polityka <span className="italic" style={{ color: 'var(--accent)' }}>prywatności</span>
          </h1>
          <p className="label-mono opacity-60 mb-16">Obowiązuje od 1 stycznia 2025 r.</p>

          <section className="prose-custom space-y-10">
            <p className="text-lg leading-relaxed opacity-90" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              Niniejsza polityka prywatności opisuje, w jaki sposób przetwarzane są dane osobowe
              osób korzystających ze strony internetowej dotyczącej oferty sprzedaży nieruchomości
              w Mesznej. Dokument został przygotowany zgodnie z Rozporządzeniem Parlamentu
              Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
            </p>

            <Section number="01" title="Administrator danych osobowych">
              <p>
                Administratorem Twoich danych osobowych jest osoba fizyczna sprzedająca
                nieruchomość położoną w Mesznej (gmina Wilkowice, powiat bielski, województwo
                śląskie), zwana dalej „Administratorem".
              </p>
              <p>
                W sprawach związanych z ochroną danych osobowych, w tym realizacji praw
                wynikających z RODO, kontakt z Administratorem możliwy jest pod adresem
                e-mail: <a href="mailto:dommeszna@proton.me" className="text-[var(--accent)] hover:underline">dommeszna@proton.me</a>.
              </p>
            </Section>

            <Section number="02" title="Jakie dane zbieramy">
              <p>Przetwarzane są dane podawane dobrowolnie poprzez formularz kontaktowy:</p>
              <ul className="list-none space-y-2 pl-4 border-l border-[var(--line)] py-2">
                <li>— imię i nazwisko,</li>
                <li>— adres e-mail,</li>
                <li>— numer telefonu (jeśli zostanie podany),</li>
                <li>— treść wiadomości i informacje w niej zawarte,</li>
                <li>— adres IP urządzenia oraz dane techniczne związane z wysłaniem formularza.</li>
              </ul>
              <p>
                Nie zbieramy danych szczególnych kategorii (art. 9 RODO) ani danych dotyczących
                wyroków skazujących (art. 10 RODO).
              </p>
            </Section>

            <Section number="03" title="Cel i podstawa prawna przetwarzania">
              <p>Dane są przetwarzane w następujących celach:</p>
              <ul className="list-none space-y-3 pl-4 border-l border-[var(--line)] py-2">
                <li>
                  <strong className="font-normal">a)</strong> w celu udzielenia odpowiedzi na zapytanie
                  oraz podjęcia działań przed zawarciem ewentualnej umowy sprzedaży nieruchomości —
                  na podstawie <em>art. 6 ust. 1 lit. b RODO</em> (działania na żądanie osoby, której
                  dane dotyczą);
                </li>
                <li>
                  <strong className="font-normal">b)</strong> w celu realizacji prawnie uzasadnionego
                  interesu Administratora, polegającego na prowadzeniu korespondencji i obsłudze
                  zapytań — na podstawie <em>art. 6 ust. 1 lit. f RODO</em>;
                </li>
                <li>
                  <strong className="font-normal">c)</strong> w celu ewentualnego ustalenia,
                  dochodzenia lub obrony roszczeń — na podstawie <em>art. 6 ust. 1 lit. f RODO</em>.
                </li>
              </ul>
              <p className="bg-[var(--bg-alt)] border border-[var(--line)] p-5 text-sm leading-relaxed">
                <strong className="font-normal">Wysyłając wiadomość przez formularz kontaktowy,</strong> potwierdzasz, że zapoznałaś/eś się
                z niniejszą polityką prywatności i akceptujesz przetwarzanie podanych danych w
                celu udzielenia odpowiedzi na Twoje zapytanie.
              </p>
            </Section>

            <Section number="04" title="Okres przechowywania">
              <p>
                Dane są przechowywane przez okres niezbędny do realizacji celów, dla których
                zostały zebrane, nie dłużej jednak niż:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l border-[var(--line)] py-2">
                <li>— 6 miesięcy od ostatniej korespondencji, jeśli nie doszło do dalszych ustaleń,</li>
                <li>— do czasu zakończenia ewentualnej transakcji oraz przez okres wymagany
                  przepisami prawa, jeśli korespondencja doprowadzi do zawarcia umowy,</li>
                <li>— do czasu przedawnienia roszczeń, jeśli zaistnieje taka potrzeba.</li>
              </ul>
            </Section>

            <Section number="05" title="Twoje prawa">
              <p>W związku z przetwarzaniem danych przysługują Ci następujące prawa:</p>
              <ul className="list-none space-y-2 pl-4 border-l border-[var(--line)] py-2">
                <li>— prawo dostępu do danych (art. 15 RODO),</li>
                <li>— prawo do sprostowania danych (art. 16 RODO),</li>
                <li>— prawo do usunięcia danych — „prawo do bycia zapomnianym" (art. 17 RODO),</li>
                <li>— prawo do ograniczenia przetwarzania (art. 18 RODO),</li>
                <li>— prawo do przenoszenia danych (art. 20 RODO),</li>
                <li>— prawo do sprzeciwu wobec przetwarzania (art. 21 RODO),</li>
                <li>— prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
                  (ul. Stawki 2, 00-193 Warszawa).</li>
              </ul>
              <p>
                Aby skorzystać z powyższych praw, wystarczy wysłać wiadomość na adres{' '}
                <a href="mailto:dommeszna@proton.me" className="text-[var(--accent)] hover:underline">dommeszna@proton.me</a>.
              </p>
            </Section>

            <Section number="06" title="Odbiorcy danych">
              <p>
                Dane mogą być udostępniane podmiotom świadczącym usługi techniczne związane z
                prowadzeniem strony i obsługą poczty elektronicznej, w szczególności:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l border-[var(--line)] py-2">
                <li>— dostawcy hostingu strony (np. Vercel Inc., Netlify Inc.),</li>
                <li>— dostawcy usług poczty elektronicznej (Proton AG, Szwajcaria),</li>
                <li>— dostawcy systemu obsługi formularzy (jeżeli zostanie zastosowany).</li>
              </ul>
              <p>
                Dane nie są przekazywane do państw trzecich poza Europejskim Obszarem
                Gospodarczym, z wyjątkiem przekazania do Szwajcarii (kraj uznany przez Komisję
                Europejską za zapewniający odpowiedni poziom ochrony danych — decyzja
                wykonawcza (UE) 2000/518) w związku z korzystaniem z usług Proton.
              </p>
            </Section>

            <Section number="07" title="Pliki cookies i technologie podobne">
              <p>
                Strona nie wykorzystuje plików cookies do celów marketingowych, profilowania ani
                analitycznych. Wykorzystywane są wyłącznie techniczne mechanizmy przeglądarki
                (np. zapamiętywanie preferencji motywu jasny/ciemny), które są niezbędne do
                prawidłowego działania strony i nie wymagają odrębnej zgody.
              </p>
            </Section>

            <Section number="08" title="Automatyczne podejmowanie decyzji">
              <p>
                Podane dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani
                profilowania w rozumieniu art. 22 RODO.
              </p>
            </Section>

            <Section number="09" title="Dobrowolność podania danych">
              <p>
                Podanie danych jest dobrowolne, jednak konieczne do udzielenia odpowiedzi na
                zapytanie. Brak podania danych uniemożliwia kontakt zwrotny.
              </p>
            </Section>

            <Section number="10" title="Zmiany polityki prywatności">
              <p>
                Niniejsza polityka prywatności może być aktualizowana. Aktualna wersja jest
                zawsze dostępna pod tym adresem. Data wejścia w życie ostatniej wersji znajduje
                się na początku dokumentu.
              </p>
            </Section>
          </section>

          <div className="mt-20 pt-10 border-t border-[var(--line)]">
            <Link href="/" className="display-serif italic text-xl hover:text-[var(--accent)] transition-colors inline-flex items-center gap-3 group">
              <Arrow size={24} direction="left" className="transition-transform duration-500 group-hover:-translate-x-1" />
              Powrót do oferty
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-4 pt-2">
        <span className="label-mono opacity-50 text-xs">{number}</span>
        <h2 className="display-serif text-2xl md:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base md:text-lg leading-relaxed opacity-90"
           style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
        {children}
      </div>
    </section>
  );
}
