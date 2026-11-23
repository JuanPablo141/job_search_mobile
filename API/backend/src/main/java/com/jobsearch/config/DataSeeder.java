package com.jobsearch.config;

import com.jobsearch.model.SearchProfile;
import com.jobsearch.model.User;
import com.jobsearch.repository.SearchProfileRepository;
import com.jobsearch.repository.UserRepository;
import com.jobsearch.service.JobService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SearchProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JobService jobService;

    public DataSeeder(UserRepository userRepository,
                      SearchProfileRepository profileRepository,
                      PasswordEncoder passwordEncoder,
                      JobService jobService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jobService = jobService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Cria usuários iniciais de teste (as vagas são alimentadas ao vivo pelo Scraper)
        User alvaro = new User(
                "alvarooliver1802@gmail.com",
                passwordEncoder.encode("123456"),
                "Alvaro Oliver",
                "123456789"
        );
        userRepository.save(alvaro);

        User demo = new User(
                "demo@jobsearch.com",
                passwordEncoder.encode("123456"),
                "Usuário Demo",
                "987654321"
        );
        userRepository.save(demo);

        // 2. Cria perfis de busca iniciais para o cálculo de aderência (AIMatcher)
        SearchProfile profile1 = new SearchProfile(
                alvaro,
                "Desenvolvedor Front-End / Full-Stack",
                "React, TypeScript, Java, Spring Boot, CSS Modules, Git, REST",
                70
        );
        profileRepository.save(profile1);

        SearchProfile profile2 = new SearchProfile(
                demo,
                "Engenheiro de Dados / Back-End",
                "Python, SQL, PostgreSQL, Docker, AWS, Spark, APIs",
                60
        );
        profileRepository.save(profile2);

        // 3. Dispara a sincronização inicial ao vivo em thread separada para popular as vagas da Gupy
        new Thread(() -> {
            try {
                Thread.sleep(1500); // Aguarda o servidor HTTP terminar de subir
                jobService.triggerManualRefresh(alvaro.getId());
            } catch (Exception ignored) {
            }
        }, "initial-scraper-thread").start();
    }
}
