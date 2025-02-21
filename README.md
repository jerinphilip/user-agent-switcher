# user-agent-switcher

Taking advantage of the recent LLM improvements, I attempt to write my own user
agent switcher. Built for personal use, mostly because
[web.whatsapp.com](https://web.whatsapp.com) refuses to open web whatsapp on my
android tablet, which I'm using as a temporary notebook with a BT keyboard
while my personal laptop is outta commission. There are probably extensions
that do this, but figure I can feel safer giving request interception access to
something I wrote.

Built to suit my requirements in under a day, would not have been possible
scouring docs otherwise alongside getting other work done.

Works for my use-case - probably generalizes too. 

# Instructions

```bash
git clone https://github.com/jerinphilip/user-agent-switcher.git
cd user-agent-switcher


web-ext build --overwrite-dest  \
    && (cd web-ext-artifacts/ && mv selective_user_agent_switcher-1.0.zip selective_user_agent_switcher-1.0.xpi)


(cd web-ext-artifacts/ && python3 -m http.server 8080)
```

From here, pick it up via local WiFi IP address from a work machine to any
mobile device. For personal use doesn't require signing and such.

A config item (`xpinstall.signature.required`) must be turned on from
`about:config`. Also need to click the Firefox logo a few times to enable Debug
mode, allowing settings UI to load extension from a file.


