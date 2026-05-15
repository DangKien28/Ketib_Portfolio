document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('main-content');
    
    // Fake Page Data as fallback for local file:// execution without server
    const fallbackPages = {
        'overview': `
            <div class="space-y-12 animate-fade-in relative z-10 w-full overflow-hidden">
                <section class="mb-12">
                    <h1 class="text-5xl font-black mb-4 font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Welcome to Kinetic Architect</h1>
                    <p class="text-neutral-400 text-lg max-w-2xl font-body leading-relaxed">
                        I am TKien, an AI systems enthusiast blending technology, design, and architecture. Let's build the future together.
                    </p>
                    <div class="mt-8 flex gap-4">
                        <button onclick="loadPage('projects')" class="bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-white/20 active:scale-95 duration-200">
                            Explore Work
                        </button>
                        <button onclick="toggleContactModal()" class="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors shadow-inner hover:shadow-white/5 active:scale-95 duration-200">
                            Let's Connect
                        </button>
                    </div>
                </section>
                
                <section>
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-xl font-bold font-headline tracking-widest text-neutral-200">FEATURED PROJECTS</h2>
                        <a onclick="loadPage('projects')" class="text-sm text-primary hover:underline cursor-pointer font-medium">View All</a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Mock Card 1 -->
                        <div onclick="loadPage('project_detail')" class="cursor-pointer bg-[#111]/80 backdrop-blur-xl rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border border-white/5 hover:border-blue-500/30 overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,123,255,0.15)] relative">
                            <div class="h-48 bg-gradient-to-br from-blue-900/40 to-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div class="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-70 transition-opacity">
                                    <span class="material-symbols-outlined text-[60px] text-blue-400">precision_manufacturing</span>
                                </div>
                            </div>
                            <div class="p-6 relative bg-gradient-to-b from-transparent to-black/80">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Go-Chat Native</h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">Go</span>
                                </div>
                                <p class="text-sm text-neutral-400 line-clamp-2">A high-performance WebSocket chat server written in Go, featuring a scalable architecture for handling concurrent real-time connections.</p>
                            </div>
                        </div>
                        
                        <!-- Mock Card 2 -->
                        <div onclick="loadPage('project_detail')" class="cursor-pointer bg-[#111]/80 backdrop-blur-xl rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border border-white/5 hover:border-purple-500/30 overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] relative">
                            <div class="h-48 bg-gradient-to-br from-purple-900/40 to-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div class="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-70 transition-opacity">
                                    <span class="material-symbols-outlined text-[60px] text-purple-400">hub</span>
                                </div>
                            </div>
                            <div class="p-6 relative bg-gradient-to-b from-transparent to-black/80">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Node API Gateway</h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest border border-purple-500/20">Node.JS</span>
                                </div>
                                <p class="text-sm text-neutral-400 line-clamp-2">A robust API Gateway utilizing Express.js to route, authenticate, and rate-limit internal microservices seamlessly.</p>
                            </div>
                        </div>

                        <!-- Mock Card 3 -->
                        <div onclick="loadPage('project_detail')" class="cursor-pointer bg-[#111]/80 backdrop-blur-xl rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm border border-white/5 hover:border-tertiary/30 overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(250,176,255,0.15)] relative">
                            <div class="h-48 bg-gradient-to-br from-pink-900/40 to-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <div class="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-70 transition-opacity">
                                    <span class="material-symbols-outlined text-[60px] text-tertiary">memory</span>
                                </div>
                            </div>
                            <div class="p-6 relative bg-gradient-to-b from-transparent to-black/80">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-lg font-bold text-white group-hover:text-tertiary transition-colors">Ketib-AI Logic</h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-widest border border-tertiary/20">Python</span>
                                </div>
                                <p class="text-sm text-neutral-400 line-clamp-2">Machine Learning core parsing user semantic requirements & portfolio routing built heavily on local transformer models.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `,
        'projects': `
            <div class="w-full">
                <div class="mb-10 text-center max-w-2xl mx-auto">
                    <h1 class="text-4xl font-headline font-black tracking-tight text-white mb-4">Project Gallery</h1>
                    <p class="text-neutral-400 text-sm font-body">A curated list of my backend, frontend, and machine learning implementations.</p>
                </div>
                <div class="flex gap-4 mb-8 justify-center flex-wrap">
                    <span class="px-4 py-2 bg-white text-black font-bold text-xs rounded-full cursor-pointer hover:bg-neutral-200 transition-colors">All</span>
                    <span class="px-4 py-2 bg-white/5 border border-white/10 text-neutral-400 font-bold text-xs rounded-full cursor-pointer hover:bg-white/10 hover:text-white transition-colors">Web Web</span>
                    <span class="px-4 py-2 bg-white/5 border border-white/10 text-neutral-400 font-bold text-xs rounded-full cursor-pointer hover:bg-white/10 hover:text-white transition-colors">Go Microservices</span>
                    <span class="px-4 py-2 bg-white/5 border border-white/10 text-neutral-400 font-bold text-xs rounded-full cursor-pointer hover:bg-white/10 hover:text-white transition-colors">AI & ML</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Project placeholders for list -->
                    <div onclick="loadPage('project_detail')" class="group cursor-pointer">
                        <div class="h-56 bg-[#111] rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm border border-white/5 mb-4 relative overflow-hidden group-hover:border-blue-500/50 transition-colors shadow-inner flex items-center justify-center">
                            <span class="material-symbols-outlined text-[64px] text-neutral-800 group-hover:text-blue-500/40 transition-colors group-hover:scale-110 duration-500">code</span>
                        </div>
                        <h3 class="text-lg font-bold text-neutral-200 group-hover:text-white mb-1 transition-colors">Dotnet Collaboration Platform</h3>
                        <p class="text-sm text-neutral-500 line-clamp-2">Real-time IDE collaboration environment powered by .NET SignalR.</p>
                    </div>
                </div>
            </div>
        `,
        'about_me': `
            <div class="max-w-4xl mx-auto py-12">
                <div class="flex flex-col md:flex-row gap-12 items-center">
                    <div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center border-4 border-black shadow-[0_0_50px_rgba(132,173,255,0.2)]">
                        <div class="text-[80px] font-black text-white mix-blend-overlay">TK</div>
                    </div>
                    <div>
                        <h2 class="text-sm font-bold text-blue-400 tracking-[0.3em] uppercase mb-2">About The Developer</h2>
                        <h1 class="text-4xl font-headline font-black text-white mb-6">Hi, I'm TKien.</h1>
                        <p class="text-neutral-400 text-lg mb-6 leading-relaxed">
                            I specialize in building intelligent, scalable backend systems and high-fidelity frontends. 
                            My passion lies in bridging the gap between machine learning concepts and tangible Web solutions.
                        </p>
                        <div class="flex gap-3">
                            <button onclick="toggleContactModal()" class="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl">Hire Me</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'collaboration': `
            <div class="max-w-6xl mx-auto py-8">
                <h1 class="text-3xl font-headline font-black mb-8 text-center">Active Partnerships & Collaborations</h1>
                <div class="bg-[#111] border border-white/5 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm p-6 shadow-2xl backdrop-blur-xl">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="text-neutral-500 border-b border-white/10 uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th class="py-4 px-4 font-bold">Project scope</th>
                                    <th class="py-4 px-4 font-bold">Client / Partner</th>
                                    <th class="py-4 px-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td class="py-4 px-4 font-medium text-white">Fullstack Portfolio Migration</td>
                                    <td class="py-4 px-4 text-neutral-400">Internal</td>
                                    <td class="py-4 px-4"><span class="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">Active</span></td>
                                </tr>
                                <tr class="hover:bg-white/5 transition-colors">
                                    <td class="py-4 px-4 font-medium text-white">Ketib-AI Microservice Integration</td>
                                    <td class="py-4 px-4 text-neutral-400">Open Source</td>
                                    <td class="py-4 px-4"><span class="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">Planning</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'project_detail': `
            <div class="max-w-4xl mx-auto py-8">
                <button onclick="loadPage('projects')" class="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group text-sm font-medium">
                    <span class="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to Gallery
                </button>
                
                <div class="h-64 md:h-96 rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 mb-10 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzYgMzR2LTE2aDJ2MTZoLTJ6bS0xOC0xNmgydjE2aC0ydy0xNnoiIGZpbGw9IiM5QzE1MzgiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvaHRtbz4=')]"></div>
                    <span class="material-symbols-outlined text-[80px] text-white/50 relative z-10">integration_instructions</span>
                </div>
                
                <div class="flex flex-col md:flex-row gap-12">
                    <div class="flex-1">
                        <h1 class="text-4xl font-headline font-black text-white mb-4">Sample Project Architecture</h1>
                        <p class="text-neutral-300 text-lg leading-relaxed mb-6">
                            This project highlights the capability of rendering mock data layouts efficiently inside a local environment without throwing CORS Fetch errors. Built directly into the SPA routing logic.
                        </p>
                        <h3 class="text-xl font-bold text-white mb-3 mt-8 border-b border-white/10 pb-2">Technical Implementations</h3>
                        <ul class="list-disc list-inside text-neutral-400 pl-4 space-y-2 mt-4 font-body">
                            <li>Virtual Routing using JavaScript Map Object</li>
                            <li>Bypass strict origin fetching restriction locally</li>
                            <li>Vanilla Javascript DOM handling with GSAP-like ease transitions</li>
                            <li>TailwindCSS inline classes injection</li>
                        </ul>
                    </div>
                    <div class="w-full md:w-64 pt-2">
                        <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Tech Stack</h4>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-2.5 py-1 bg-white/10 text-white rounded-lg text-xs font-medium border border-white/5">HTML5</span>
                                <span class="px-2.5 py-1 bg-white/10 text-white rounded-lg text-xs font-medium border border-white/5">Tailwind CSS</span>
                                <span class="px-2.5 py-1 bg-white/10 text-white rounded-lg text-xs font-medium border border-white/5">Vanilla JS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    ,
        'architect_compatibility': `<!-- Architect Compatibility Section -->
<section class="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
    <!-- Header -->
    <div class="mb-12 text-center">
        <div class="inline-block mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span class="text-primary font-mono text-xs font-bold tracking-widest uppercase">System Tooling</span>
        </div>
        <h1 class="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            ARCHITECT <span class="text-primary">COMPATIBILITY</span>
        </h1>
        <p class="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Evaluate your technical stack and project requirements against TKien's core competencies to quantify architectural synergy.
        </p>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Input Form -->
        <div class="lg:col-span-7 bg-[#111]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <h3 class="font-headline font-bold text-2xl mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">data_object</span>
                Stack configuration
            </h3>
            
            <div class="space-y-6">
                <!-- Stack Selection -->
                <div>
                    <label class="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide uppercase">Core Backend Tech Stack</label>
                    <div class="flex flex-wrap gap-2">
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">Node.js</button>
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">.NET Core</button>
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">Java / Spring</button>
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">Golang</button>
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">Python</button>
                        <button class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">Rust</button>
                    </div>
                </div>

                <!-- Infrastructure -->
                <div>
                    <label class="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide uppercase">Infrastructure Target</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-blue-400 hover:bg-blue-400/5 transition-all text-center">
                            <div class="font-bold text-sm mb-1">Docker</div>
                            <div class="text-[10px] text-neutral-500">Containerization</div>
                        </div>
                        <div class="p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-blue-400 hover:bg-blue-400/5 transition-all text-center">
                            <div class="font-bold text-sm mb-1">K8s</div>
                            <div class="text-[10px] text-neutral-500">Orchestration</div>
                        </div>
                        <div class="p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-blue-400 hover:bg-blue-400/5 transition-all text-center">
                            <div class="font-bold text-sm mb-1">AWS / Azure</div>
                            <div class="text-[10px] text-neutral-500">Cloud Native</div>
                        </div>
                        <div class="p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-blue-400 hover:bg-blue-400/5 transition-all text-center">
                            <div class="font-bold text-sm mb-1">Serverless</div>
                            <div class="text-[10px] text-neutral-500">Event-driven</div>
                        </div>
                    </div>
                </div>

                <!-- Architecture Pattern -->
                <div>
                    <label class="block text-sm font-semibold text-neutral-300 mb-3 tracking-wide uppercase">Architecture Pattern</label>
                    <select class="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-neutral-300 focus:ring-primary focus:border-primary outline-none transition-all">
                        <option>Microservices (Event-Driven)</option>
                        <option>Modular Monolith</option>
                        <option>Serverless Functions (FaaS)</option>
                        <option>Service-Oriented Architecture (SOA)</option>
                    </select>
                </div>

                <button class="w-full py-4 mt-4 bg-primary text-on-primary-fixed font-bold rounded-xl hover:bg-primary-dim transition-colors uppercase tracking-widest shadow-[0_0_20px_rgba(132,173,255,0.2)]">
                    Analyze Synergy
                </button>
            </div>
        </div>

        <!-- Result / Scoring -->
        <div class="lg:col-span-5 flex flex-col gap-6">
            <!-- Score Card -->
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-tertiary/20 blur-[50px] rounded-full"></div>
                
                <h4 class="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6 relative z-10">Match Index</h4>
                <div class="flex items-end justify-center gap-2 relative z-10 mb-2">
                    <span class="font-headline text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">92</span>
                    <span class="text-2xl text-neutral-500 pb-2">%</span>
                </div>
                <div class="text-sm text-green-400 font-medium tracking-wide mb-6">High Synergy</div>
                
                <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                    <div class="bg-gradient-to-r from-primary to-tertiary h-full rounded-full w-[92%] shadow-[0_0_10px_rgba(132,173,255,0.8)]"></div>
                </div>
            </div>

            <!-- Detailed Metrics -->
            <div class="bg-[#111]/50 backdrop-blur-xl rounded-3xl border border-white/5 p-6 flex-1">
                <h4 class="font-headline font-bold text-lg mb-4 text-white">Competency Breakdown</h4>
                
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-neutral-400">Backend Development</span>
                            <span class="text-white font-mono">95%</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-blue-400 h-full rounded-full w-[95%]"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-neutral-400">Cloud Infrastructure</span>
                            <span class="text-white font-mono">88%</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-blue-400 h-full rounded-full w-[88%]"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-neutral-400">System Design (Microservices)</span>
                            <span class="text-white font-mono">100%</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-purple-400 h-full rounded-full w-[100%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-neutral-400">AI Integration</span>
                            <span class="text-white font-mono">90%</span>
                        </div>
                        <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-tertiary h-full rounded-full w-[90%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`,
        'ai_project_estimator': `<!-- AI Project Estimator Section -->
<section class="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
    <!-- Header -->
    <div class="mb-12 text-center relative z-10">
        <div class="inline-block mb-3 px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20">
            <span class="text-tertiary font-mono text-xs font-bold tracking-widest uppercase">Estimation Engine</span>
        </div>
        <h1 class="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            AI PROJECT <span class="text-tertiary">ESTIMATOR</span>
        </h1>
        <p class="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Calculate the scope, timeline, and architectural requirements for your AI-integrated microservices product.
        </p>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        <!-- Configuration Form -->
        <div class="lg:col-span-8 bg-[#111]/80 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div class="flex items-center justify-between mb-8">
                <h3 class="font-headline font-bold text-2xl flex items-center gap-2">
                    <span class="material-symbols-outlined text-tertiary">tune</span>
                    Project Parameters
                </h3>
                <button class="text-xs text-neutral-400 hover:text-white border border-white/10 bg-white/5 px-3 py-1 rounded-lg flex items-center gap-1 transition-all">
                    <span class="material-symbols-outlined text-[14px]">refresh</span> Reset
                </button>
            </div>
            
            <div class="space-y-8">
                
                <!-- Category: AI Complexity -->
                <div>
                    <div class="flex justify-between items-end mb-4">
                        <label class="block text-sm font-bold text-white tracking-wide uppercase">AI Model Complexity</label>
                        <span class="text-tertiary font-mono text-xs" id="ai-complexity-val">Advanced</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-tertiary hover:bg-tertiary/5 transition-all">
                            <h4 class="font-bold text-sm mb-2">Basic Integration</h4>
                            <p class="text-[11px] text-neutral-500">API wrapping (OpenAI, Anthropic) without custom fine-tuning.</p>
                        </div>
                        <div class="p-4 rounded-xl border border-tertiary bg-tertiary/10 cursor-pointer shadow-[0_0_15px_rgba(250,176,255,0.15)] transition-all">
                            <h4 class="font-bold text-sm mb-2 text-white">Advanced (RAG)</h4>
                            <p class="text-[11px] text-neutral-300">Retrieval-Augmented Generation, Vector DBs, Semantic Search.</p>
                        </div>
                        <div class="p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-tertiary hover:bg-tertiary/5 transition-all">
                            <h4 class="font-bold text-sm mb-2">Custom Pipeline</h4>
                            <p class="text-[11px] text-neutral-500">Fine-tuning, Agentic workflows, Model deployment, MLOps.</p>
                        </div>
                    </div>
                </div>

                <div class="h-px bg-white/5 w-full"></div>

                <!-- Category: Backend Scope -->
                <div>
                    <label class="block text-sm font-bold text-white mb-4 tracking-wide uppercase">System Architecture</label>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-neutral-300">Target User Base (MAU)</h4>
                                <p class="text-xs text-neutral-500">Scalability requirements limit.</p>
                            </div>
                            <div class="w-1/2">
                                <input type="range" min="1" max="100" value="25" class="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-tertiary">
                                <div class="flex justify-between text-[10px] text-neutral-500 mt-1">
                                    <span>&lt; 5k</span>
                                    <span class="text-white font-bold">~25k</span>
                                    <span>&gt; 1M+</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-sm font-bold text-neutral-300">Data Synchronization</h4>
                                <p class="text-xs text-neutral-500">Real-time vs Batch operations.</p>
                            </div>
                            <div class="flex bg-surface-container-highest rounded-lg border border-white/10 p-1">
                                <button class="px-3 py-1 text-xs rounded-md text-neutral-400 hover:text-white transition-all">Batch Processing</button>
                                <button class="px-3 py-1 text-xs rounded-md bg-white/10 text-white shadow-inner transition-all">Real-time (WebSockets/gRPC)</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-px bg-white/5 w-full"></div>

                <!-- Timeline Preference -->
                <div>
                    <label class="block text-sm font-bold text-white tracking-wide uppercase mb-4">Delivery Timeline Phase</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer group">
                            <div class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center group-hover:border-tertiary">
                                <div class="w-2 h-2 rounded-full bg-transparent"></div>
                            </div>
                            <span class="text-sm text-neutral-400 group-hover:text-white">Normal (3-6 Months)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer group">
                            <div class="w-4 h-4 rounded-full border border-tertiary flex items-center justify-center shadow-[0_0_10px_rgba(250,176,255,0.4)]">
                                <div class="w-2 h-2 rounded-full bg-tertiary"></div>
                            </div>
                            <span class="text-sm text-white font-medium">Accelerated (&lt; 3 Months)</span>
                        </label>
                    </div>
                </div>

            </div>
        </div>

        <!-- Estimation Result Output -->
        <div class="lg:col-span-4 flex flex-col gap-6">
            
            <div class="bg-gradient-to-b from-[#1a1520] to-[#0e0e0e] backdrop-blur-xl rounded-3xl border border-tertiary/20 p-8 shadow-[0_20px_40px_rgba(250,176,255,0.05)] relative overflow-hidden">
                <div class="absolute -right-20 -top-20 w-40 h-40 bg-tertiary/20 blur-[50px] rounded-full"></div>
                
                <h4 class="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2">Estimated Output</h4>
                <div class="h-px w-12 bg-tertiary/50 mb-6"></div>

                <div class="space-y-6">
                    <div>
                        <div class="text-xs text-neutral-500 uppercase tracking-widest mb-1">Architecture Base</div>
                        <div class="font-headline text-lg font-bold text-white">Microservices + RAG AI</div>
                    </div>
                    
                    <div>
                        <div class="text-xs text-neutral-500 uppercase tracking-widest mb-1">Est. Development Time</div>
                        <div class="font-headline text-3xl font-bold text-white tracking-tighter">8 - 12 <span class="text-lg text-neutral-500 font-light">Weeks</span></div>
                    </div>
                    
                    <div>
                        <div class="text-xs text-neutral-500 uppercase tracking-widest mb-1">Recommended Stack</div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <span class="px-2 py-1 text-[10px] bg-tertiary/10 border border-tertiary/20 text-tertiary rounded font-mono">Go</span>
                            <span class="px-2 py-1 text-[10px] bg-primary/10 border border-primary/20 text-primary rounded font-mono">Node.js</span>
                            <span class="px-2 py-1 text-[10px] bg-white/5 border border-white/10 text-neutral-300 rounded font-mono">Python</span>
                            <span class="px-2 py-1 text-[10px] bg-white/5 border border-white/10 text-neutral-300 rounded font-mono">PostgreSQL</span>
                            <span class="px-2 py-1 text-[10px] bg-white/5 border border-white/10 text-neutral-300 rounded font-mono">Redis</span>
                        </div>
                    </div>
                </div>

                <button class="w-full py-4 mt-8 bg-gradient-to-r from-tertiary to-purple-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest">
                    Request Proposal
                </button>
            </div>
            
            <!-- Quick Tip -->
            <div class="bg-surface-container-highest border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
                <p class="text-xs text-neutral-400 leading-relaxed">
                    Estimates are dynamic approximations. A direct consultation will yield a precise architecture blueprint and exact technical scopes.
                </p>
            </div>

        </div>

    </div>
</section>`
};

    window.loadPage = async function(pageName) {
        try {
            // Start exit transition
            contentArea.classList.remove('opacity-100', 'translate-y-0');
            contentArea.classList.add('opacity-0', 'translate-y-4');
            
            await new Promise(r => setTimeout(r, 200)); // wait for fade out
            
            let htmlData = "";
            try {
                // If running locally (file://), this API will fail due to CORS
                const response = await fetch(`pages/user/${pageName}.html?v=${new Date().getTime()}`, { cache: "no-store" });
                if (response.ok) {
                    htmlData = await response.text();
                } else {
                    htmlData = fallbackPages[pageName] || `<div class="p-8 text-center text-error"><h2 class="text-2xl font-bold text-red-400">404 - Page Not Found</h2><p>The page ${pageName} could not be loaded.</p></div>`;
                }
            } catch (e) {
                // If fetching fails, inject from Fake Data
                const fallbackMessageText = `<div class="w-full p-4 mb-4 text-sm bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 rounded-xl text-center">Using Mock Data for "${pageName}" due to CORS fetch limitations locally.</div>`;
                htmlData = fallbackPages[pageName] ? fallbackMessageText + fallbackPages[pageName] : `<div class="p-8 text-center"><h2 class="text-2xl font-bold text-red-400">404 - Missing Fake Data</h2><p>Could not load ${pageName} locally.</p></div>`;
            }
            
            contentArea.innerHTML = htmlData;
            
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('bg-white/10', 'text-white', 'shadow-inner', 'border', 'border-white/5');
                if(link.dataset.page === pageName) {
                    link.classList.add('bg-white/10', 'text-white', 'shadow-inner', 'border', 'border-white/5');
                    link.classList.remove('text-neutral-400');
                } else {
                    link.classList.add('text-neutral-400');
                }
            });
            
            // Allow DOM to process innerHTML before transitioning back
            requestAnimationFrame(() => {
                contentArea.classList.remove('opacity-0', 'translate-y-4');
                contentArea.classList.add('opacity-100', 'translate-y-0');
            });
            
        } catch (error) {
            console.error('Error loading page:', error);
            contentArea.innerHTML = `<div class="p-8 text-center text-red-500"><h2 class="text-2xl font-bold">Error</h2><p>Could not load ${pageName}.</p></div>`;
            contentArea.classList.remove('opacity-0', 'translate-y-4');
            contentArea.classList.add('opacity-100', 'translate-y-0');
        }
    };

    // Load initial page
    loadPage('overview');

    // Make floating chat draggable vertically
    const fabCluster = document.getElementById('fab-cluster');
    const fabMainBtn = document.getElementById('fab-main-btn');
    if (fabCluster) {
        let isDragging = false;
        let startY, initialTop;
        let hasMoved = false;

        fabCluster.addEventListener('mousedown', (e) => {
            if(e.button !== 0) return; // Left click only
            
            isDragging = true;
            hasMoved = false;
            startY = e.clientY;
            initialTop = fabCluster.offsetTop;
            document.body.style.userSelect = 'none'; // Prevent text selection
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            let deltaY = e.clientY - startY;
            if (Math.abs(deltaY) > 5) {
                hasMoved = true; // Drag threshold
                e.preventDefault();
            }
            
            let newTop = initialTop + deltaY;
            
            // Constrain to window bounds
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - fabCluster.offsetHeight));
            
            // Remove Tailwind class that interferes with inline top
            fabCluster.classList.remove('top-1/2', '-translate-y-1/2');
            fabCluster.style.top = `${newTop}px`;
            fabCluster.style.bottom = 'auto';
            fabCluster.style.transform = 'none';
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                
                // If it was just a click and the target is the button, toggle menu
                if (!hasMoved && e.target.closest('#fab-main-btn')) {
                    window.toggleFabMenu();
                }
            }
        });
    }
});

// Chat Window Controller
window.toggleFabMenu = function() {
    const menu = document.getElementById('fab-menu');
    const icon = document.getElementById('fab-icon');
    
    if (menu.classList.contains('opacity-0')) {
        // Open menu
        menu.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        menu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        
        // Change icon to close
        icon.innerText = 'close';
        icon.style.transform = 'rotate(90deg)';
    } else {
        // Close menu
        menu.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
        menu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        
        // Change icon back to chat
        icon.innerText = 'chat';
        icon.style.transform = 'rotate(0deg)';
    }
};

window.currentChatType = '';

window.openChat = function(type) {
    // Tự động đóng menu bong bóng chat nếu đang mở
    const menu = document.getElementById('fab-menu');
    if (!menu.classList.contains('opacity-0')) {
        window.toggleFabMenu();
    }
    
    const chatWindow = document.getElementById('chat-window');
    const title = document.getElementById('chat-title');
    const icon = document.getElementById('chat-icon');
    const iconContainer = document.getElementById('chat-icon-container');
    const messages = document.getElementById('chat-messages');
    
    // Set Config based on type
    if (type === 'ai') {
        window.currentChatType = 'AI';
        title.innerText = 'Ketib-AI Support';
        title.className = 'font-headline font-bold text-sm tracking-widest uppercase text-tertiary';
        icon.innerText = 'smart_toy';
        icon.className = 'material-symbols-outlined text-tertiary text-sm';
        iconContainer.className = 'w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center';
        
        // Add greeting if empty
        if (messages.children.length === 0) {
            messages.innerHTML = `<div class="self-start max-w-[85%] bg-surface-container-highest border border-tertiary/20 p-3 rounded-2xl rounded-tl-sm text-neutral-300 shadow-sm leading-relaxed">
                Hello! I am Ketib-AI. How can I assist you with exploring the portfolio today?
            </div>`;
        }
    } else if (type === 'tkien') {
        window.currentChatType = 'TKIEN';
        title.innerText = 'Chat with TKien';
        title.className = 'font-headline font-bold text-sm tracking-widest uppercase text-primary';
        icon.innerText = 'person';
        icon.className = 'material-symbols-outlined text-primary text-sm';
        iconContainer.className = 'w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center';
        
        // Add greeting if empty
        if (messages.children.length === 0) {
            messages.innerHTML = `<div class="self-start max-w-[85%] bg-surface-container-highest border border-primary/20 p-3 rounded-2xl rounded-tl-sm text-neutral-300 shadow-sm leading-relaxed">
                Hi there! I'm TKien. Feel free to leave a message and I'll get back to you ASAP!
            </div>`;
        }
    }

    // Show Window
    chatWindow.classList.remove('opacity-0', 'translate-y-12', 'scale-95', 'pointer-events-none');
    chatWindow.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    
    // Focus Input
    setTimeout(() => {
        document.getElementById('chat-input').focus();
    }, 300);
};

window.closeChat = function() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.remove('opacity-100', 'translate-y-0', 'scale-100', 'pointer-events-auto');
    chatWindow.classList.add('opacity-0', 'translate-y-12', 'scale-95', 'pointer-events-none');
    
    // Clear messages for next open (Optional)
    setTimeout(() => {
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('chat-input').value = '';
    }, 300);
};

window.handleChatSubmit = function(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const messages = document.getElementById('chat-messages');

    // Add User Message
    const userMsgHTML = `
        <div class="self-end max-w-[85%] bg-primary/20 border border-primary/30 p-3 rounded-2xl rounded-tr-sm text-white shadow-sm leading-relaxed">
            ${msg}
        </div>
    `;
    messages.insertAdjacentHTML('beforeend', userMsgHTML);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // Simulate Reply (Optional)
    const replyColor = window.currentChatType === 'AI' ? 'tertiary' : 'primary';
    setTimeout(() => {
        const replyMsgHTML = `
            <div class="self-start max-w-[85%] bg-surface-container-highest border border-${replyColor}/20 p-3 rounded-2xl rounded-tl-sm text-neutral-300 shadow-sm leading-relaxed flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-${replyColor} animate-pulse"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-${replyColor} animate-pulse" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-${replyColor} animate-pulse" style="animation-delay: 0.4s"></span>
            </div>
        `;
        messages.insertAdjacentHTML('beforeend', replyMsgHTML);
        messages.scrollTop = messages.scrollHeight;
        
        // Remove typing indicator and add final message
        setTimeout(() => {
            messages.lastElementChild.remove();
            const finalReplyMsgHTML = `
                <div class="self-start max-w-[85%] bg-surface-container-highest border border-${replyColor}/20 p-3 rounded-2xl rounded-tl-sm text-neutral-300 shadow-sm leading-relaxed">
                    Message received! This is a demo interface. Backend integration needed further setup!
                </div>
            `;
            messages.insertAdjacentHTML('beforeend', finalReplyMsgHTML);
            messages.scrollTop = messages.scrollHeight;
        }, 1500);

    }, 500);
};

// Contact Modal Controller
window.toggleContactModal = function() {
    const modal = document.getElementById('contact-modal');
    const body = document.getElementById('contact-modal-body');
    const isClosed = modal.classList.contains('pointer-events-none');
    
    if(isClosed) {
        // Open
        modal.classList.remove('pointer-events-none', 'opacity-0');
        modal.classList.add('opacity-100');
        
        setTimeout(() => {
            body.classList.remove('scale-95', 'translate-y-8', 'opacity-0');
            body.classList.add('scale-100', 'translate-y-0', 'opacity-100');
        }, 50); // slight delay for smooth staggered effect
        
        document.body.style.overflow = 'hidden';
    } else {
        // Close
        body.classList.add('scale-95', 'translate-y-8', 'opacity-0');
        body.classList.remove('scale-100', 'translate-y-0', 'opacity-100');
        
        setTimeout(() => {
            modal.classList.add('pointer-events-none', 'opacity-0');
            modal.classList.remove('opacity-100');
        }, 300); // Wait for body transition
        
        document.body.style.overflow = '';
    }
};

// Navigation Icon Dropdowns
window.toggleDropdown = function(id, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const dropdown = document.getElementById(id);
    const isClosed = dropdown.classList.contains('opacity-0');
    
    // Đóng tất cả dropdowns trước
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
        menu.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0');
    });
    
    if (isClosed) {
        // Mở dropdown được chọn
        dropdown.classList.remove('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
        dropdown.classList.add('opacity-100', 'visible', 'scale-100', 'translate-y-0');
    }
};

// Đóng dropdown khi click ra ngoài vùng menu
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-trigger')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
            menu.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0');
        });
    }
});