package com.example.projectBackend.Repository;

import com.example.projectBackend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product ,Long> {

  List<Product> findByFarmer_Id(Long id);

  List<Product> findByCategory_Id(Long id);

  @Query("SELECT COUNT(p) FROM Product p WHERE p.farmer.id = :farmerId")
  long countProductsByFarmer(Long farmerId);

  @Query("""
          SELECT DISTINCT p FROM Product p
          LEFT JOIN p.category c
          LEFT JOIN p.specifications s
          WHERE LOWER(p.product_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(s.value) LIKE LOWER(CONCAT('%', :keyword, '%'))
          """)
  List<Product> searchByKeyword(@Param("keyword") String keyword);

}
