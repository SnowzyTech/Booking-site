import type { Metadata } from "next";

import { ScaOrder } from "@/components/sca/sca-order";

import "./sca.css";

/*
 * Sugar Control Accelerator — a standalone sales page (/sca).
 *
 * It lives OUTSIDE the app/(public) route group on purpose, so it inherits only
 * the root layout (fonts) and carries no site navbar or footer. It is a campaign
 * page: nothing here touches the booking wizard, the database or the admin
 * dashboard — the only interactive part is <ScaOrder>, which takes payment via
 * Paystack or bank transfer and hands the buyer off to WhatsApp.
 *
 * Markup and copy are reproduced from
 * _mockups/sugar-control-accelerator-preview.html; styles live in ./sca.css.
 */

export const metadata: Metadata = {
  title: "Sugar Control Accelerator",
  description:
    "A private nutrition consultation for people living with diabetes — stop guessing what to eat and finally find out why your sugar won’t stay down.",
  alternates: { canonical: "/sca" },
  // Campaign landing page reached by a shared link, not meant for search.
  robots: { index: false, follow: false },
};

export default function ScaPage() {
  return (
    <>
      {/* Top banner */}
      <section className="ef2a74de">
        <div className="sca-inner" style={{ maxWidth: 1100 }}>
          <div className="e52e6b43 te">
            <p>PRIVATE NUTRITION CONSULTATION&nbsp;&nbsp;•&nbsp;&nbsp;THE SUGAR CONTROL ACCELERATOR</p>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="e9531985">
        <div className="sca-inner" style={{ maxWidth: 860, gap: 18 }}>
          <h1 className="e269e0d3">STOP GUESSING WHAT TO EAT…</h1>
          <h2 className="e6513270">
            AND FINALLY FIND OUT WHY YOUR SUGAR LEVEL WON’T STAY DOWN!
          </h2>

          <div className="sca-rule">
            <span />
          </div>

          <div className="e0c5c7fd te">
            <p>
              If you’re tired of being told{" "}
              <strong className="sca-hl">
                “don’t eat rice, don’t eat yam, don’t eat swallow”
              </strong>
              …
            </p>
            <p>
              Tired of <strong className="sca-hl">eating food that has no taste</strong>, just
              because you’re diabetic…
            </p>
            <p>
              Yet every time you check your reading,{" "}
              <strong className="sca-hl">your heart starts beating fast</strong> because your
              sugar is still all over the place.{" "}
              <strong className="sca-hl">Down today, up tomorrow…</strong>
            </p>
          </div>

          <div className="e128b2f3 te">
            <p style={{ textAlign: "center" }}>
              <span className="sca-pill sca-pill--orange">THEN THIS IS FOR YOU!</span>
            </p>
          </div>

          <div className="ed23f082 te">
            <p>
              Sit down with me and my team in a{" "}
              <strong className="sca-hl">Private Nutrition Consultation</strong> and discover{" "}
              <strong className="sca-hl">exactly what YOU should be eating</strong>, so you can
              stop letting diabetes dictate every meal on your plate.
            </p>
          </div>

          <div style={{ height: 6 }} />

          <div className="sca-cta-wrap">
            <a className="e1818e81" href="#order">
              GRAB THE SUGAR CONTROL ACCELERATOR NOW <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="e5d9dc9f te">
            <p style={{ textAlign: "center" }}>
              Only <strong className="sca-naira">₦20,500</strong>&nbsp;&nbsp;•&nbsp;&nbsp;Limited slots
            </p>
          </div>
        </div>
      </section>

      {/* Linda bio */}
      <section className="e90c192c">
        <div className="sca-inner" style={{ maxWidth: 1000, gap: 28 }}>
          <h2 className="e0ed9047">HI, I’m Linda Chikaodi</h2>
          <div className="ed3ac94a">
            <div className="e81e74ef">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ee8e25d9" src="/images/linda-sca.png" alt="Linda Chikaodi" />
            </div>
            <div className="e0f21ddb">
              <div className="e36f675c te">
                <p>
                  And for over <strong className="sca-hl">7 years</strong>, I’ve been helping
                  people living with diabetes{" "}
                  <strong className="sca-hl">come out of the confusion about food</strong>…
                </p>
                <p>
                  Through the Crush Your Sugar Challenge alone, we’ve impacted{" "}
                  <strong className="sca-hl">over 11,000 diabetics</strong> and reached{" "}
                  <strong className="sca-hl">over 1,000,000 people</strong> within and outside
                  Nigeria.
                </p>
              </div>
              <div className="e6cad4a2">
                <div className="e6b0d549">
                  <div className="e6f03675">
                    <h3 className="e099950d">11,000+</h3>
                    <div className="e1600a35 te">
                      <p style={{ textAlign: "center" }}>diabetics impacted</p>
                    </div>
                  </div>
                </div>
                <div className="e8d116ec">
                  <div className="e1738f7d">
                    <h3 className="e11e20b8">1,000,000+</h3>
                    <div className="e3d9c172 te">
                      <p style={{ textAlign: "center" }}>people reached</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="e3898d19">
        <div className="sca-inner" style={{ maxWidth: 780, gap: 18 }}>
          <div className="e1fb17c2 te">
            <p>But over the years…</p>
          </div>
          <h2 className="ef28c105">WE NOTICED SOMETHING WE COULDN’T IGNORE</h2>
          <div className="e3926305 te">
            <p>You see…</p>
            <p>
              Many diabetics are{" "}
              <strong className="sca-hl">not failing because they don’t care</strong>.
            </p>
            <p>
              They’re failing because they’re following{" "}
              <strong className="sca-hl">advice that was never meant for them</strong>.
            </p>
          </div>

          <div className="ea09f76b">
            <div className="ea170b33 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--x">✕</span>
                  <span>Advice from random WhatsApp messages…</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--x">✕</span>
                  <span>Advice from the neighbour who may know nothing about your condition…</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--x">✕</span>
                  <span>Advice from that different video that finally confused you…</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="e953f48f te">
            <p>
              So you <strong className="sca-hl">cut out everything you love</strong>.
            </p>
            <p>
              You <strong className="sca-hl">take your drugs on time</strong>.
            </p>
            <p>
              You’re <strong className="sca-hl">watching what you eat</strong>.
            </p>
          </div>

          <div className="e0fd630f">
            <h3 className="ef29d0da">YET YOUR SUGAR LEVEL STILL WON’T BEHAVE!</h3>
          </div>

          <div className="e93bd04c te">
            <p>And you’re there thinking…</p>
          </div>

          <div className="e658cda1">
            <div className="e95e60af te">
              <p>
                <em>“Wetin I dey do wrong?”</em>
              </p>
              <p>
                <em>“Is it the rice? Is it the fruit? Is it the time I’m eating?”</em>
              </p>
              <p>
                <em>“Is this how I’ll continue living for the rest of my life?”</em>
              </p>
            </div>
          </div>

          <div className="e0cb1e29 te">
            <p>The truth is…</p>
            <p>
              You may be making{" "}
              <strong className="sca-hl">
                small mistakes with your portions, your food combinations
              </strong>
              , or even the{" "}
              <strong className="sca-hl">“healthy” foods you’re eating</strong>, quietly pushing
              your sugar up <strong className="sca-hl">without you knowing</strong>.
            </p>
            <p>
              Or maybe you are{" "}
              <strong className="sca-hl">
                so confused that you actually no longer know what to even do again
              </strong>
              , because you have tried different advice, and instead of getting better.
            </p>
            <p>
              <strong className="sca-hl">Nothing has changed.</strong>
            </p>
            <p>
              And <strong className="sca-hl">nobody has sat down with you</strong> to look at what
              YOU actually eat, and{" "}
              <strong className="sca-hl">WHAT is actually the Problem</strong>.
            </p>
          </div>

          <h2 className="ef9ebdac">THAT’S EXACTLY WHAT WE WANT TO DO FOR YOU.</h2>
        </div>
      </section>

      {/* What you get */}
      <section className="e1012f03">
        <div className="sca-inner" style={{ maxWidth: 820, gap: 20 }}>
          <div className="e0becd7b te">
            <p style={{ textAlign: "center" }}>
              <span className="sca-pill sca-pill--purple">THE SUGAR CONTROL ACCELERATOR</span>
            </p>
          </div>
          <h2 className="e8e81973">
            HERE’S WHAT YOU GET WHEN YOU PICK UP THE SUGAR CONTROL ACCELERATOR:
          </h2>

          <div style={{ height: 4 }} />

          {/* 1 */}
          <div className="e8a6a63e">
            <div className="e2217bea te">
              <div className="sca-item-head">
                <span className="sca-num">1</span>
                <span className="sca-item-title">Nutrition Intake Assessment</span>
              </div>
            </div>
            <div className="e4a23d59 te">
              <p>
                You see, <strong className="sca-hl">one thing we don’t do is guesswork</strong>.
                Because in health management, people differ; how they react to things differs and
                even <strong className="sca-hl">how they react to different foods differs</strong>.
              </p>
              <p>So before we even get on a call, you’ll fill out a form that helps us know you better:</p>
            </div>
            <div className="e6b4cb24 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>your medical history,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>your food patterns,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>your lifestyle,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>and everything you’ve been trying to do to manage your sugar level.</span>
                </li>
              </ul>
            </div>
            <div className="e24ede6a te">
              <p>
                With this, <strong className="sca-hl">we are not coming on that call to guess things</strong>;
                we already understand, to some extent, who you are and what you might even be needing
                for <strong className="sca-hl">sustainable results</strong>.
              </p>
              <p>
                <em>And this is just the first step.</em>
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="e4ef8aa3">
            <div className="e1e27a1c te">
              <div className="sca-item-head">
                <span className="sca-num">2</span>
                <span className="sca-item-title">
                  A 30-Minute Private Consultation session and Recall Analysis
                </span>
              </div>
            </div>
            <div className="e9227665 te">
              <p>
                When it comes to proper blood sugar management, there is a lot of confusion and it
                can be{" "}
                <strong className="sca-hl">very exhausting if there is NO ONE to speak to</strong>,
              </p>
              <p>And this is what this private session is about.</p>
              <p>
                It’s a <strong className="sca-hl">30-minute intimate conversation with us</strong>.
              </p>
              <p>Where you tell us your frustrations…</p>
              <p>What you’ve been doing…</p>
              <p>
                <strong className="sca-hl">the questions you’ve been afraid to ask anyone</strong>.
              </p>
              <p>
                And we’ll show you{" "}
                <strong className="sca-hl">where you’ve been getting it wrong</strong>, and{" "}
                <strong className="sca-hl">what you should be doing instead</strong>.
              </p>
              <p>
                <em>We are not stopping here.</em>
              </p>
              <p>Right immediately after that call, my team and I will spring into action to design…</p>
            </div>
          </div>

          {/* 3 */}
          <div className="eae97ba9">
            <div className="e8f6d055 te">
              <div className="sca-item-head">
                <span className="sca-num">3</span>
                <span className="sca-item-title">Your Personalised 7-Day Meal Guide</span>
              </div>
            </div>
            <div className="ed0eda82 te">
              <p>
                Right after the call, we prepare a{" "}
                <strong className="sca-hl">PDF made just for you</strong>.
              </p>
              <p>
                This is not a meal plan. <strong className="sca-hl">It’s a meal guide.</strong>
              </p>
              <p>
                Let me explain. Inside this PDF, based on what we have seen, heard, and shared during
                your 30-minute private session.
              </p>
              <p>
                We will show <strong className="sca-hl">what you’re eating now</strong>,{" "}
                <strong className="sca-hl">how you should eat it now</strong>, and{" "}
                <strong className="sca-hl">alternatives to the foods you’re used to</strong>, so you
                can <strong className="sca-hl">still enjoy your meals</strong>.
              </p>
              <p>
                <em>And that’s not all</em>
              </p>
            </div>
          </div>

          {/* 4 */}
          <div className="e923a736">
            <div className="e2e44158 te">
              <div className="sca-item-head">
                <span className="sca-num">4</span>
                <span className="sca-item-title">7 Days of Follow-Up</span>
              </div>
            </div>
            <div className="e1a61dbe te">
              <p>
                After you have gotten your 7-day meal guide.{" "}
                <strong className="sca-hl">My team and I will follow up with you for 7 days</strong>.
              </p>
              <p>This is when we know if you are beginning to implement the little critical things we advised.</p>
            </div>
            <div className="e94e3bf9 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>Clear any pending confusion,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>answer your questions,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>correct your mistakes,</span>
                </li>
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>and keep you on track.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 5 — bonus */}
          <div className="e18f135d">
            <div className="ea38fd54 te">
              <p>
                <span className="sca-pill--bonus">BONUS</span>
              </p>
            </div>
            <div className="e301850c te">
              <div className="sca-item-head">
                <span className="sca-num">5</span>
                <span className="sca-item-title">FREE Access to Our Diabetic Community</span>
              </div>
            </div>
            <div className="e5f55720 te">
              <p>
                This is <strong className="sca-hl">exclusive to the first 30 people</strong> who
                will pick this <strong>Sugar Control Accelerator.</strong> We will be giving you{" "}
                <strong className="sca-hl">exclusive Free Access</strong> to join other diabetics who
                are learning, sharing their wins and supporting one another. In our Diabetic Community.
              </p>
              <p>
                That way, <strong className="sca-hl">you don’t have to be alone in this journey</strong>.
              </p>
            </div>
          </div>

          <div style={{ height: 8 }} />

          <div className="sca-cta-wrap">
            <a className="eb64ce42" href="#order">
              GRAB THE SUGAR CONTROL ACCELERATOR NOW <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="e7403e43">
        <div className="sca-inner" style={{ maxWidth: 820, gap: 14 }}>
          <h3 className="e907a70c">So Who Exactly is this For</h3>
          <h2 className="e0f4205b">THIS SUGAR CONTROL ACCELERATOR IS FOR YOU IF…</h2>

          <div className="e34b9b5d">
            <div className="e9e7769b te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>
                    <strong style={{ color: "#1D1620" }}>You’re still confused about what to eat.</strong>{" "}
                    You’re tired of conflicting advice about rice, swallow, yam and fruits, and you
                    just want someone to tell you clearly what works for YOUR body.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="eae2eb15">
            <div className="e7f15052 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>
                    <strong style={{ color: "#1D1620" }}>
                      You’re taking your medications, but your sugar still fluctuates.
                    </strong>{" "}
                    It’s low today, high tomorrow, and you don’t know what you’re doing wrong.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="e6d76b07">
            <div className="e881ed16 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>
                    <strong style={{ color: "#1D1620" }}>
                      You’re tired of living in a prison of tasteless food.
                    </strong>{" "}
                    You want to enjoy good, delicious Nigerian meals again without your sugar level
                    jumping.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="e506bf2e">
            <div className="ec6f8771 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>
                    <strong style={{ color: "#1D1620" }}>
                      You’ve attended the Crush Your Sugar Challenge, but you need personal guidance.
                    </strong>{" "}
                    You’ve learnt the basics, and now you want someone to look at YOUR situation.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="e95e761d">
            <div className="e7731af1 te">
              <ul className="sca-list">
                <li className="sca-li">
                  <span className="sca-badge sca-badge--check">✓</span>
                  <span>
                    You’ve been following my teaching, and you have a lot of questions you want to
                    personally ask me and clear out the confusion in your head so you begin to crush
                    those high numbers holistically.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="eec66a78 te">
            <p>If you see yourself in any of these…</p>
            <p>
              <strong className="sca-hl">This consultation was designed with you in mind.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Order */}
      <section className="e3e7d1bf" id="order">
        <div className="sca-inner" style={{ maxWidth: 720, gap: 18 }}>
          <div className="ec7a2ea2">
            <div className="e5c90a95 te">
              <p style={{ textAlign: "center" }}>
                <span className="sca-pill sca-pill--purple">YOUR INVESTMENT TODAY</span>
              </p>
            </div>
            <h3 className="e4cbd87a">ALL OF THIS FOR JUST</h3>
            <h2 className="e3f98e27">₦20,500</h2>
            <div className="ecb5c742 te">
              <p>
                <strong className="sca-hl">Slots are limited</strong> because my team can only
                attend to a few people at a time.
              </p>
            </div>

            <ScaOrder />

            <div className="eb2f14c9 te">
              <p>
                <em>
                  This consultation works alongside your doctor’s care and prescribed medications.
                  It does not replace them.
                </em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="e930d6ea">
        <div className="sca-inner" style={{ maxWidth: 1000, gap: 18 }}>
          <div className="e14f4733 te">
            <p style={{ textAlign: "center" }}>
              © 2026 Linda Chikaodi Austin. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
