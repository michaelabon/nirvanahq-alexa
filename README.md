Alexa skill to add to-dos to NirvanaHQ
======================================

**Unofficial** Alexa skill to add to-dos to your [NirvanaHQ] inbox.

Goal
----

I like being able to use Alexa to throw reminders onto lists.
Being able to say,
"Alexa, tell [OurGroceries] to add milk,"
is very convenient.
I want that convenience with my preferred Getting Things Done (GTD) app.

Setup
-----------

Nirvana does not have an open API.
So, this skill uses [your personal, secret _@nirvanahq.in_ email address][inmail]
as the `NIRVANA_EMAIL` env variable.

You also need a free SendGrid account.
Set the API key as the `SENDGRID_API_KEY` environment variable.

Next work
---------


Look into https://github.com/KayLerch/alexa-utterance-generator


[inmail]: https://account.nirvanahq.com/dashboard#inmail
[NirvanaHQ]: https://www.nirvanahq.com/
[OurGroceries]: https://www.ourgroceries.com/

License
--------

ISC
