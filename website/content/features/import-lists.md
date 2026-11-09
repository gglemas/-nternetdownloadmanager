---
name: Import lists
title: Import a download list
headline: Bring an existing list into your queue.
line: Import an .ef2 export or text file with links, referrers, and cookies.
lede: Import an .ef2 export or a text list of links. Available addresses, referrers, and cookies are retained.
description: Import an .ef2 export or text list of links into Mister Download Manager, retaining available referrers and cookies.
group: organising
order: 160
since: 0.1.0
shot: images/help/link-grabber.webp
shot_alt: Link grabber listing imported links in packages, with their names, sizes and whether they are online
where: Tasks → Import
help: adding-downloads.md#a-list-of-links
---

## Your list comes over in one file

Save a download list as an `.ef2` export file, then choose **Tasks → Import** in MDM and select it. Each entry keeps its address and any available referrer or cookies, then joins the **Main download queue**.

## A plain list of links works too

**Tasks → Import → From text file** reads a text file and picks out every web address in it. You can also drop a `.txt` or `.ef2` list straight onto the download list. Untick what you don't want, and add the rest to the queue.

To export a list, choose **Tasks → Export** and save it as a text file or `.ef2` export.

## Review before adding

An import opens **Link grabber**, which sorts links into packages: archive volumes together, links from one page together, and the rest in **Various files**. Each link is checked for its name, size, and availability; missing links and items already in your list start unticked.

**Add to queue** adds selected links to the **Main download queue**, and **Start** starts the queue as well. An `.ef2` file retains each download's available referrer and cookies. See [Link grabber and archives](link-grabber.md).
