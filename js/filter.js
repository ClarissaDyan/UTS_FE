document.addEventListener('DOMContentLoaded', () => {
    const courses = [
        {
            title: 'Adobe After Effects [2020]',
            description: 'Kuasai motion graphics dan efek visual dari dasar hingga mahir dengan panduan lengkap dari pakar di bidangnya.',
            instructor: 'Darius',
            level: 'Beginner',
            videos: 9,
            students: 456,
            price: 120000,
            image: '/static/AdobeEA.jpeg',
            category: 'Adobe'
        },
        {
            title: 'Kuliah Struktur Data [2020]',
            description: 'Pelajari konsep fundamental struktur data seperti Array, Linked List, Stack, dan Queue untuk membangun algoritma yang efisien.',
            instructor: 'Darius',
            level: 'Intermediate',
            videos: 13,
            students: 231,
            price: 230000,
            image: '/static/StrukturData.jpg',
            category: 'Programming'
        },
        {
            title: 'Roblox Studio untuk Prototyping Game [2025]',
            description: 'Belajar membuat game pertamamu di platform Roblox. Mulai dari desain level, scripting dasar dengan Lua, hingga publikasi.',
            instructor: 'Darius',
            level: 'Beginner',
            videos: 5,
            students: 783,
            price: 0,
            image: '/static/Roblox.jpg',
            category: 'Roblox'
        },
        {
            title: 'Blender 3D Modelling [2020]',
            description: 'Ciptakan model 3D yang menakjubkan dari nol. Pelajari teknik-teknik sculpting, texturing, dan rendering di Blender.',
            instructor: 'Darius',
            level: 'Intermediate',
            videos: 9,
            students: 556,
            price: 50000,
            image: '/static/Blender.jpg',
            category: 'Blender'
        },
        {
            title: 'Object Oriented Programming [2020]',
            description: 'Pahami pilar-pilar OOP (Encapsulation, Inheritance, Polymorphism) untuk menulis kode yang lebih bersih, modular, dan reusable.',
            instructor: 'Darius',
            level: 'Professional',
            videos: 10,
            students: 92,
            price: 80000,
            image: '/static/OOP.jpg',
            category: 'Programming'
        }
    ];

    const courseListContainer = document.querySelector('.course-list');
    const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');

    function displayCourses(filteredCourses) {
        // Hapus semua card yang ada, kecuali header
        courseListContainer.innerHTML = `<div class="list-header"><p>${filteredCourses.length} Hasil</p></div>`;

        if (filteredCourses.length === 0) {
            courseListContainer.innerHTML += '<p style="text-align: center; margin-top: 20px;">Tidak ada kursus yang cocok dengan filter Anda.</p>';
            return;
        }

        filteredCourses.forEach(course => {
            const courseCardHTML = `
                <div class="course-card">
                    <div class="card-left">
                        <img src="${course.image}" alt="Course Thumbnail">
                        <span class="price">${course.price === 0 ? 'Gratis' : `Rp${course.price.toLocaleString('id-ID')}`}</span>
                    </div>
                    <div class="card-right">
                        <div class="course-info">
                            <h4>${course.title}</h4>
                            <p class="description">${course.description}</p>
                            <p class="instructor">Dengan Instruktur ${course.instructor}</p>
                            <div class="meta-info">
                                <span>${course.level}</span><span>•</span><span>${course.videos} Video</span><span>•</span><span>${course.students} Pelajar</span>
                            </div>
                        </div>
                        <div class="buttons">
                            <a href="#" class="btn btn-card">Lihat</a>
                            <a href="/pembayaran.html" class="btn btn-card">Beli</a>
                        </div>
                    </div>
                </div>
            `;
            courseListContainer.insertAdjacentHTML('beforeend', courseCardHTML);
        });
    }

    function filterCourses() {
        const activeFilters = {
            video_count: [],
            materi: [],
            harga: [],
            level: []
        };

        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                activeFilters[checkbox.name].push(checkbox.id);
            }
        });
        
        const filteredCourses = courses.filter(course => {
            const videoFilterPassed = activeFilters.video_count.length === 0 || activeFilters.video_count.some(filterId => {
                if (filterId === 'v1') return course.videos >= 1 && course.videos <= 10;
                if (filterId === 'v2') return course.videos >= 11 && course.videos <= 20;
                return false;
            });

            const materiFilterPassed = activeFilters.materi.length === 0 || activeFilters.materi.some(filterId => {
                if (filterId === 'm1') return course.category === 'Adobe';
                if (filterId === 'm2') return course.category === 'Blender';
                if (filterId === 'm3') return course.category === 'Roblox';
                if (filterId === 'm4') return course.category === 'Programming';
                return false;
            });

            const hargaFilterPassed = activeFilters.harga.length === 0 || activeFilters.harga.some(filterId => {
                if (filterId === 'p1') return course.price === 0;
                if (filterId === 'p2') return course.price > 0 && course.price < 200000;
                if (filterId === 'p3') return course.price >= 200000;
                return false;
            });

            const levelFilterPassed = activeFilters.level.length === 0 || activeFilters.level.some(filterId => {
                if (filterId === 'l1') return course.level === 'Beginner';
                if (filterId === 'l2') return course.level === 'Intermediate';
                if (filterId === 'l3') return course.level === 'Professional';
                return false;
            });

            return videoFilterPassed && materiFilterPassed && hargaFilterPassed && levelFilterPassed;
        });

        displayCourses(filteredCourses);
    }

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterCourses);
    });

    displayCourses(courses);
});