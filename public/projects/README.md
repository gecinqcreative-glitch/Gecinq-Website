# Project media

Drop one poster + one preview clip per project here, named after the project `slug`
(see `src/data/projects.ts`):

```
<slug>.jpg   # poster — shown by default (first paint, good LCP). ~1280×800, 16:10
<slug>.mp4   # preview — played muted/looped on hover. Short (3–8s), H.264, no audio
```

Example for "Poz — DCA Lab" (slug `poz-dca-lab`):

```
poz-dca-lab.jpg
poz-dca-lab.mp4
```

Missing files degrade gracefully: a procedural accent-colored placeholder poster is
shown instead, and tiles without a working video simply keep their poster on hover.
