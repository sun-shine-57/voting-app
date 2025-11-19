package com.online.voting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.swing.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String question;

    // This annotation will create a separate table for Id and options
    // without creating separate entity
    @ElementCollection
    private List<OptionVote> options = new ArrayList<>();

//    @ElementCollection
//    private List<Long> votes = new ArrayList<>();
}
