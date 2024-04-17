function _populateSkills(skills) {

    for (skillset in skills) {
        let skillslist = skills[skillset].map(item =>
            `<div class="skill">
                <i class="${item.fontAwesomeClass}"></i>
                <p>${item.label}</p>
            </div>`
        ).join('');

        $('#skills').append(
            `<div class="skill-cntr">
                <div class="skill-label">
                    <p class="tag">${skillset}</p>
                </div>
                <div class="skill-list">
                    ${skillslist}
                </div>
            </div>`
        );
    }
}

function _populateProjects(projects) {

    projects.map(project => {
        let tags = project.tags.map(item =>
            `<li class="tag">${item}</li>`
        ).join('');

        let links = !project.isLive ? `<p>[Coming Soon]</p>` :
            project.links.map(link => {
                return `<a href="${link.ref}" aria-describedby="external-link">${link.text}</a>`;
            }).join('');

        $('#projects').append(
            `<div class="project-card">
                <div class="project-techs">
                    <ul class="no-style-list">${tags}</ul>
                </div>
                <div class="project-overview">
                    <p class="project-title">${project.title}</p>
                    <p class="project-subtitle">${project.subtitle}</p>
                    <p class="project-summary">${project.blurb}</p>
                    <p class="project-links">${links}</p>
                </div>
            </div>`
        );
    })
}

function _populateEducation(items) {
    let education = items.map(item =>
        `<div class="timeline__container" data-professional="${item.isProfessional}">
            <div class="timeline__entry">
                <h3>${item.title}</h3>
                <p>${item.body}</p>
                <p>${item.award}</p>
            </div>
        </div>`
    ).join('');

    $('#education').append(
        `<div class="timeline">
            ${education}
        </div>`
    );
}

function populateContent(data) {
    _populateSkills(data.skills);
    _populateProjects(data.projects);
    _populateEducation(data.education);
}

function setActiveNavLink(target) {
    $('#site-nav a').removeClass('site-nav__btn--active');
    $(target).addClass('site-nav__btn--active');
}

function setActiveNavLinkOnScroll() {
    const sections = $('section').not('#blurb');

    sections.each(function () {
        const rect = this.getBoundingClientRect();

        if (rect.top >= 0) {
            const targetId = $(this).attr('id');
            const navLink = $('#site-nav a[href="#' + targetId + '"]');
            setActiveNavLink(navLink)
            return false;
        }
    });
}

function onFilterBtnClick(isProfessional) {

    const profBtn = $('button#filter__prof');
    const academicBtn = $('button#filter__academic');

    function toggleProfessional() {
        profBtn.toggleClass("filter-btn--pressed");
        $('[data-professional="false"]').toggle();
    }

    function toggleAcademic() {
        academicBtn.toggleClass("filter-btn--pressed");
        $('[data-professional="true"]').toggle();
    }

    switch (isProfessional) {
        case true:
            toggleProfessional();

            if (academicBtn.hasClass("filter-btn--pressed")) {
                toggleAcademic();
            }

            break

        case false:
            toggleAcademic();

            if (profBtn.hasClass("filter-btn--pressed")) {
                toggleProfessional();
            }

            break

    }
}

$(document).ready(function () {
    $.ajax({
        url: 'assets/data/data.json',
        dataType: 'json',
        success: function (data) {
            populateContent(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error loading JSON:', textStatus, errorThrown);
        }
    });

    $(document).scroll(function () {
        setActiveNavLinkOnScroll();
    });

    $('#site-nav a').click(function (e) {
        e.preventDefault();

        let targetId = $(this).attr('href')
        let targetOffset = $(targetId).offset().top;

        $('html, body').animate({
            scrollTop: targetOffset
        }, 0);
    });

    $('button#filter__academic').click(function (e) {
        onFilterBtnClick(false);
    })

    $('button#filter__prof').click(function () {
        onFilterBtnClick(true);
    })

    $('.about__card header').click(function () {
        $(this).find('i').toggleClass('about__expanded-caret')
        $(this).siblings('.about-collapse').slideToggle('slow');
    });

});
