#!/usr/bin/env node

// Import script to add blog posts to the database
import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Blog posts data
const blogPosts = [
  {
    title: "Astronomical Evolution V – How does Changes at Quantum Level produce Immense Astronomical Energy? Stellar Evolution III",
    slug: "astronomical-evolution-v-quantum-level-astronomical-energy-stellar-evolution-iii",
    content: `At the quantum level, how does sun react to produce the immense energy at the astronomical level? Let's find out!

The mass of one hydrogen atom is 1.008, and the mass of one Helium atom is 4.0026.

We know that the Helium atom originated from four hydrogen atoms.

So mathematically,
4✕Hydrogen = 4✕1.008 = **4.032**.

But the net mass of Helium is **4.0026**.

The difference equals 0.0294, or in percentage, **0.7%.**

I hope you remember when I earlier mentioned that the Sun only converts 0.7% of its mass to energy. This tiny difference in mass is responsible for almost all of the energy that the sun generates. And this is the source that keeps the sun from collapsing.

**But, being a Quantum physics enthusiast, Let's go deeper.**

You are now aware of the fact that energy comes from the reduction of mass. But where does this come from?

# **Let's unravel it in a quantum way.**

If we talk in terms of energy units, the mass of a proton will be 938.3 MeV, while the mass of a neutron will be 939.6 MeV. We know Helium has two protons and two neutrons. Therefore,

2✕proton = 2 ✕ 938.3 = 1876.6Mev, and
2✕neutron = 2 ✕ 939.6 = 1879.2Mev

When we add them up, we get the total mass of 3755.8 MeV. But the actual mass of Helium is 3728.4 MeV. The difference between the two comes out to be 27.4 Mev, or **0.7%**

## But what actually happened? How does Helium have lower energy units than the four individual nucleons?

Actually, it turns out that the four nucleons of Helium are more stable when they are together than when they are separated. This higher stability is the reason behind the difference in energy units. Helium has four nucleons, which implies that it has more binding energy than hydrogen, which has only one nucleon. Binding energy is the energy required to pull the nucleons apart. Hydrogen has zero binding energy as there isn't any other nucleon to pull the proton from.

This is the quantum mechanical explanation of why the sun releases so much energy. This energy from within helps the sun fight the battle for its survival against the collapsing gravitational force.`,
    excerpt: "At the quantum level, how does sun react to produce the immense energy at the astronomical level? Let's find out!",
    category: "Stellar Evolution",
    tags: ["Quantum Physics", "Stellar Evolution", "Astronomical Evolution", "Astrophysics"],
    authorName: "Salik Riyaz",
    authorTitle: "Founder & Astrophysicist",
    publishedAt: "2024-03-15T00:00:00Z",
    featured: true,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2024/03/nuclear-fusion-reactor-in-china-burns-hotter-than-the-sun.jpeg"
  },
  {
    title: "Astronomical Evolution V – Quantum Tunneling – Stellar Evolution II",
    slug: "astronomical-evolution-v-quantum-tunneling-stellar-evolution-ii",
    content: `Investigate the Sun's energy generation! Discover the mysteries of proton collisions, quantum tunneling, the Coulomb barrier, and the puzzle of like-charged particles colliding.

## Quantum tunneling:

This is a phenomenon where a particle, say an atom, has the capability to teleport to the other side of a barrier. The wavefunction propagates through the potential barrier by disappearing on one side and reappearing on the other. It is possible due to the uncertainty principle in quantum mechanics. The Sun uses this trick to increase the efficiency of nuclear reactions.

**ΔE * Δt ≥ h / 4π**, where e is energy, t is time and h is planks constant **(h=6.6✕10^-34)**

This says: uncertainty in energy times Uncertainty in time equals a constant.

If energy is borrowed and given back in such a short period of time that it cannot be measured, it is permitted. It is such that the universe didn't record it. This is the nature of quantum mechanics.

This implies that the protons can borrow energy for a very short period of time, such that it tunnels through the Coulomb's barrier as if it weren't there. Therefore, instead of going over the ridge, it goes straight through the barrier and travels to the other side.

This phenomenon significantly enhances the sustainability of fusion, in the sun.

Now, after the protons have collided, they usually fly apart. But as mentioned earlier, rarely something different would happen—beta decay. Beta decay causes protons and neutrons to switch identities.

This is the process of the formation of neutron from a proton and this is the first step in the process of transformation of Hydrogen to helium, which is the main objective of nuclear fusion in Sun.`,
    excerpt: "Investigate the Sun's energy generation! Discover the mysteries of proton collisions, quantum tunneling, the Coulomb barrier, and the puzzle of like-charged particles colliding.",
    category: "Stellar Evolution",
    tags: ["Quantum Physics", "Stellar Evolution", "Astronomical Evolution", "Astronomy"],
    authorName: "Salik Riyaz",
    authorTitle: "Founder & Astrophysicist",
    publishedAt: "2024-02-19T00:00:00Z",
    featured: true,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2024/02/the-sun-has-gone-wrong-and-scientists-dont-know-why.jpg"
  },
  {
    title: "Hawking Radiation",
    slug: "hawking-radiation",
    content: `Understanding Hawking Radiation: Introduced by physicist Stephen Hawking in 1974, this phenomenon reveals the intricate connection between black holes, quantum mechanics, and the cosmos.

# **Understanding Hawking Radiation**

Within the vastness of the universe, black holes remain mysterious and fascinating objects. Introduced in 1974 by the brilliant physicist Stephen Hawking, Hawking radiation is one of the most intriguing phenomena related to these cosmic behemoths.

## **Quantum Mechanics and Virtual Particles**

The complex interplay of quantum mechanics is at the core of Hawking radiation. This basic hypothesis holds that space is not really empty, but rather teeming with virtual particles that appear and go in an instant. These virtual particles can materialize close to a black hole's event horizon, where one particle falls into the hole while its counterpart escapes into space.

## **Zero-Point Fluctuations and Vacuum Polarization**

The nature of Hawking radiation is further clarified by the concept of vacuum fluctuations, which is explained by the Lamb shift phenomenon. These fluctuations cause subtle energy level shifts in particles such as electrons; this phenomenon has important ramifications for our comprehension of the quantum world.

## **Conspiracy of Black Hole Radiation**

At first look, the idea that black holes release radiation could seem irrational. Hawking's hypothesis, however, offers a convincing answer. The feeble radiation seen from these celestial objects is caused by the possibility that when virtual particle pairs materialize close to the event horizon, one of the pairs may fall into the black hole and the other may escape.

## Conclusion

Originating from the combination of general relativity and quantum mechanics, this phenomenon provides an enticing look into the inner workings of the cosmos. We are faced with the sobering truth that our comprehension of the cosmos is simply a momentary glimpse of a reality far larger and more intricate than we can comprehend when we consider the mystery of black holes and the radiation they release.`,
    excerpt: "Understanding Hawking Radiation: Introduced by physicist Stephen Hawking in 1974, this phenomenon reveals the intricate connection between black holes, quantum mechanics, and the cosmos.",
    category: "Black Holes",
    tags: ["Quantum Physics", "Black Holes", "Astronomy"],
    authorName: "hiuaz",
    authorTitle: "Contributing Writer",
    publishedAt: "2024-02-10T00:00:00Z",
    featured: false,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2024/02/black-hole-wallpaper-1.jpg"
  },
  {
    title: "Introduction To Black Holes",
    slug: "introduction-to-black-holes",
    content: `Let's study the black holes. Why are Black Holes black? What's accretion disk and how's it formed? What is an Ergosphere?

The interesting domain of astrophysics dives into the study of black holes, which first got significant attention in 1967 owing to American physicist John Wheeler. Prior to his influence, astronomers often referred to these celestial wonders as "Totally Gravitationally Collapsed Objects." 

Supermassive black holes, which exist in the centers of huge galaxies, have masses that are millions or billions of times larger than our Sun. These enigmatic phenomena have gravitational forces so strong that even light succumbs to their attraction, forcing objects to move faster than the speed of light to escape—an idea that challenges the principles of Albert Einstein's special theory of relativity, published in 1905.

Stephen Hawking and Roger Penrose further illuminated the mysteries of black holes, demonstrating that time itself concludes within these cosmic entities. The singularity at the heart of a black hole, a point in space-time where curvature becomes infinite, imprisons objects, rendering escape impossible.

## Why are Black Holes black?

This color results from their strong gravitational attraction, which is caused by their strong gravitational fields. Black holes don't have surfaces, but they do have a unique boundary called an event horizon. The event horizon of the most basic black hole is a sphere with a radius known as the Schwarzschild radius (R=2GM/c^2).

## What's accretion disk and how's it formed?

An accretion disk, a spinning disk of matter, is formed when a star approaches a black hole. When a portion of the star's radiation interacts with the disk close to the event horizon, it releases X-rays. Once an item crosses the Schwarzschild radius, escape from the black hole's gravity becomes impossible.

## What is an Ergosphere?

The ergosphere, also known as **Kerr black holes**, a third area where a black hole affects nearby space, is introduced by rotating black holes. A swirling black hole's ergosphere is the area outside its event horizon where spacetime is pulled into its interior by its revolution. The rotation of the black hole causes space itself to rotate within this region.

## Conclusion

In conclusion, many people are curious about the study of black holes, which was made popular by the film Interstellar. In order to comprehend these cosmic occurrences, it is necessary to decipher the complexities of space-time curvature, gravity, and the enormous effects that black holes have on their surroundings.`,
    excerpt: "Let's study the black holes. Why are Black Holes black? What's accretion disk and how's it formed? What is an Ergosphere?",
    category: "Black Holes",
    tags: ["Black Holes", "Astronomy"],
    authorName: "hiuaz",
    authorTitle: "Contributing Writer",
    publishedAt: "2024-01-14T00:00:00Z",
    featured: false,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2024/01/premium-photo-_-stunning-realistic-wallpaper-of-a-black-hole-deep-space-starry-astrophotography-universe-cosmus-space-background-generative-ai.jpg"
  },
  {
    title: "What actually is Astronomy?",
    slug: "what-actually-is-astronomy",
    content: `NO! Astronomy isn't only the study of the celestial objects and limiting ourselves to them only. Astronomy isn't only about studying planets, moons, galaxies, etc. Rather…

## **What is Astronomy in simple words?**

Astronomy is an aspect of science devoted to investigating the universe. It is a branch of natural science that analyzes celestial objects and events. It explains their origin and evolution using mathematics, physics, and chemistry.

## Is it really just this?

NO! Astronomy isn't only the study of the celestial objects and limiting ourselves to them only. Astronomy isn't only about studying planets, moons, galaxies, etc. Rather, Astronomy can be said to be an envelop to everything we study(on a macro level, especially).

## So, what actually is it?

As I said before, it is like an envelop which includes the study of everything in the universe. From Big Bang to Big Crunch, from evolution to deterioration, humans, life, psychology, philosophy, the enigmatic creation, it gives us the primary knowledge about everything and obviously the prime and the all of it about the outer space.

> **Astronomy is what leads a lost spirit beyond the horizons to the road of being acquainted with thyself.**
> 
> AstroSalik Riyaz, Founder.

## Is Astronomy same as Astrology?

The answer is obvious and the answer is, No! There is lot of difference between these two. The difference of the land and the sky. While Astronomy deals with the study of the universe for the betterment of our understanding and advancing in our life, Astrology says that it can predict future by studying the stars, planets and so which is absolutely in opposition of Science and Astronomy.

## Observational Astronomy:

This area of study uses telescopes and other tools to see celestial objects and record data. Observational astronomers examine a wide range of light wavelengths, including gamma rays and radio waves, in order to develop a thorough picture of the universe.

## Astrophysics:

Astrophysics is the study of astronomical objects using physics concepts. It tries to understand the fundamental processes that control the universe, such as stellar evolution, galaxies' behavior, the nature of dark matter and dark energy, and the genesis and fate of the universe itself.

## Cosmology:

The area of astronomy known as cosmology explores the large-scale structure, genesis, and evolution of the cosmos. It aims to provide deep answers regarding the origins, growth, and ultimate destiny of the cosmos.

## Planetary Science:

The study of planets, moons, asteroids, and other solar system objects is the main goal of planetary science. In order to understand the genesis, evolution, and habitability of planets, scientists in this subject investigate their geological, atmospheric, and physical characteristics.

## Astrobiology:

Astrobiology investigates the potential for extraterrestrial life. This multidisciplinary field of study looks into the prerequisites needed for life to arise and persist in a variety of settings, including harsh ones.

## Summary:

The science of astronomy helps us learn more about our universe and ourselves. Though it also helps us become more conscious of ourselves, its primary focus is the study of space. It tells us about evolution and retrogression in addition to discussing the universe.

Astronomy encompasses almost everything.`,
    excerpt: "NO! Astronomy isn't only the study of the celestial objects and limiting ourselves to them only. Astronomy isn't only about studying planets, moons, galaxies, etc. Rather…",
    category: "Astronomy",
    tags: ["Astronomy", "The realm of Truth"],
    authorName: "Salik Riyaz",
    authorTitle: "Founder & Astrophysicist",
    publishedAt: "2023-12-31T00:00:00Z",
    featured: false,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2023/12/pexels-photo-447329-1.jpeg"
  },
  {
    title: "The history of the founder's nickname, \"Astro\"",
    slug: "the-history-of-the-founders-nickname-astro",
    content: `The story behind the founder's nickname "Astro" and how it shaped the journey of Zoonigia.

The nickname "Astro" didn't come out of nowhere. It's deeply rooted in a passion for astronomy that began at a very young age. As a child, I was always fascinated by the night sky, spending countless hours gazing at the stars and wondering about the vastness of the universe.

## The Beginning

My interest in astronomy started when I was just 8 years old. I remember the first time I saw Saturn through a telescope - it was a moment that changed my life forever. The rings, the beauty, the sheer magnificence of it all sparked something inside me that has never died down.

## The Journey

As I grew older, my passion for astronomy only intensified. I would spend entire nights reading about stars, planets, galaxies, and the mysteries of the cosmos. My friends and family started noticing this obsession, and gradually, they began calling me "Astro" - a nickname that perfectly captured my love for all things astronomical.

## The Impact

This nickname became more than just a name; it became an identity. It represented my dedication to understanding the universe and my desire to share that knowledge with others. When I founded Zoonigia, the name "AstroSalik" felt natural - it was the perfect combination of my identity and my mission.

## The Mission

Today, as AstroSalik Riyaz, I continue to pursue my passion for astronomy while helping others discover the wonders of the universe. Zoonigia is not just a platform; it's a manifestation of that 8-year-old boy's dream to explore the cosmos and share that wonder with the world.

The nickname "Astro" serves as a constant reminder of where I came from and where I'm going - always reaching for the stars, always exploring the infinite possibilities that the universe has to offer.`,
    excerpt: "The story behind the founder's nickname \"Astro\" and how it shaped the journey of Zoonigia.",
    category: "Personal",
    tags: ["The realm of Truth", "Personal Story"],
    authorName: "Salik Riyaz",
    authorTitle: "Founder & Astrophysicist",
    publishedAt: "2024-01-27T00:00:00Z",
    featured: false,
    imageUrl: "https://zoonigia.wordpress.com/wp-content/uploads/2024/01/download-5.jpg"
  }
];

async function importBlogPosts() {
  try {
    console.log('Starting blog import...');
    
    for (const post of blogPosts) {
      console.log(`Importing: ${post.title}`);
      
      // Insert blog post
      const query = `
        INSERT INTO blog_posts 
        (title, slug, content, excerpt, category, tags, author_name, author_title, published_at, featured, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          excerpt = EXCLUDED.excerpt,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          author_name = EXCLUDED.author_name,
          author_title = EXCLUDED.author_title,
          published_at = EXCLUDED.published_at,
          featured = EXCLUDED.featured,
          image_url = EXCLUDED.image_url;
      `;
      
      await pool.query(query, [
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.category,
        post.tags,
        post.authorName,
        post.authorTitle,
        post.publishedAt,
        post.featured,
        post.imageUrl
      ]);
    }
    
    console.log('Blog import completed successfully!');
    
    // Check what was imported
    const result = await pool.query('SELECT title, author_name, published_at FROM blog_posts ORDER BY published_at DESC');
    console.log('Imported posts:');
    result.rows.forEach(row => {
      console.log(`- ${row.title} by ${row.author_name} (${row.published_at})`);
    });
    
  } catch (error) {
    console.error('Error importing blogs:', error);
  } finally {
    await pool.end();
  }
}

importBlogPosts();