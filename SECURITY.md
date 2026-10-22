# Security review

Reviewed on October 22, 2026. Changes need deployment to affect the live site.

## Contact form fixes

The contact API previously trusted anything sent to it. Browser validation did not protect the endpoint. Invalid email values and oversized messages reached a fake webhook during reproduction.

The updated API does the following.

- Validates name, email, and message on the server. Both forms use the same rules.
- Limits names to 100 characters, emails to 254, and messages to 1,024. The message limit matches a Discord embed field.
- Rejects request bodies larger than 16 KiB, including chunked requests without a declared size.
- Accepts JSON and rejects browser requests marked cross-site.
- Silently ignores submissions that fill the hidden `website` field. Normal visitors do not see or tab into it.
- Disables Discord mentions, uses a fixed notification title, and stops echoing personal data in responses.
- Limits webhook requests to ten seconds without automatic retries. Failures return generic errors.

The hidden field should catch basic bots that fill every input. It is a heuristic, not proof that a visitor is human. A bot can send valid JSON with an empty hidden field. Marketing messages sent by humans can still pass.

There is no rate limiter in this change. An in-memory limiter resets and does not coordinate across server instances. Trusting arbitrary forwarded IP headers also allows bypasses. Hosting configuration was not available to establish a reliable client IP or shared storage.

If spam continues, the next step is [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) with server verification, plus a rate limit at the hosting provider. Turnstile needs a site key and secret key. Neither is required for the protection added here.

## Other changes

Notifications now render plain text. The old HTML rendering had no demonstrated exploit because existing messages were hardcoded. Removing it prevents future notification text from becoming an HTML injection path.

Responses now include `nosniff`, a policy that blocks embedding the site in frames, and a referrer policy. Contact responses are not cached. Nuxt DevTools are disabled by default.

Nuxt was updated from 3.14.1592 to 3.21.11. Nitro, h3, and other compatible dependencies were refreshed. Nuxt Image was updated to 2.2.0, with IPX 4 and Sharp 0.35.5. The supported Node range is declared in `package.json`.

## Remaining dependency warnings

`npm audit` reported 74 affected dependency entries before updates and 24 afterward. These counts include parent packages that inherit the same underlying advisory. They are not counts of exploitable site bugs. The remaining report contains two critical, thirteen high, seven moderate, and two low entries.

| Dependency area | Remaining concern | What this site exposes |
| --- | --- | --- |
| Nuxt Content 2 and its older MDC dependency | Markdown HTML sanitization advisories, including critical severity | Project markdown comes from this repository. The site has no visitor markdown upload or rendering feature. No exploitable visitor input path was found. |
| Older Unhead through Nuxt Content | Head sanitization advisories | Page metadata is hardcoded. No untrusted metadata path was found. |
| Nuxt UI 2 | Form markup advisory | This site uses native forms with explicit `method="post"`, not the affected UI form components. |
| Braces, PostCSS selector parser, and their parent packages | Resource exhaustion while processing patterns or CSS | Inputs are the project's build files. No visitor-controlled pattern or stylesheet input was found. |
| Node-forge through development tooling | RSA verification advisory | No application certificate or signature verification uses this package. |

A clean dependency audit still requires follow-up. Several recommended fixes migrate Nuxt Content or Nuxt UI across major versions. This review does not force those migrations or incompatible dependency overrides. Re-run `npm audit` as patched releases become available.

## Verification

Run `npm run test:security` to build the production site and run the HTTP checks. The script starts isolated local servers and replaces the Discord destination with a local receiver. It never contacts Discord.

Checks cover valid delivery, field types and limits, malformed JSON, the hidden bot field, cross-site requests, oversized bodies with and without Content-Length, upstream failures, retries, missing configuration, page responses, security headers, project content, and image processing.

Both contact pages were also exercised in a browser against the local receiver. The deployed site, host-level limits, and live Discord configuration were not tested.

The build emits a Nuxt Image warning about its optional `nuxt/server` helper on Nuxt 3. The production image endpoint was exercised successfully. This site does not import that helper.

## Design choices

Poteto-mode's Model the Domain principle led to one shared submission schema. Boundary Discipline put checks at the HTTP endpoint. Laziness Protocol favored a hidden field over a custom challenge service. Prove It Works and Test Behavior, Not Implementation led to tests against the built HTTP server and actual forms.

The work checkpoint kept dependency updates separate from contact implementation. One implementation owner updated both forms and the endpoint. An independent reviewer checked the changes. One additional design reviewer could not start because of model capacity. The parent compared the simple approach with signed challenges and Turnstile; the available reviewer agreed with the simple first pass.
