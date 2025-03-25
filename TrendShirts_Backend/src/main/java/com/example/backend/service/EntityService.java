package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.repository.EntityRepository;
import com.example.backend.model.Entity;

import java.util.List;

@Service
public class EntityService {

    private final EntityRepository entityRepository;

    @Autowired
    public EntityService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    public List<Entity> findAll() {
        return entityRepository.findAll();
    }

    public Entity findById(Long id) {
        return entityRepository.findById(id).orElse(null);
    }

    public Entity save(Entity entity) {
        return entityRepository.save(entity);
    }

    public void deleteById(Long id) {
        entityRepository.deleteById(id);
    }
}