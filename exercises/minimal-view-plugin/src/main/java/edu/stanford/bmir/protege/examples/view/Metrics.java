package edu.stanford.bmir.protege.examples.view;

import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import org.protege.editor.owl.model.OWLModelManager;
import org.protege.editor.owl.model.event.EventType;
import org.protege.editor.owl.model.event.OWLModelManagerListener;

public class Metrics extends JPanel {

    private final JButton refreshButton = new JButton("Refresh");
    private final JLabel textComponent = new JLabel();
    private final OWLModelManager modelManager;

    private final ActionListener refreshAction = event -> recalculate();

    private final OWLModelManagerListener modelListener = event -> {
        if (event.getType() == EventType.ACTIVE_ONTOLOGY_CHANGED) {
            recalculate();
        }
    };

    public Metrics(OWLModelManager modelManager) {
        this.modelManager = modelManager;
        recalculate();
        modelManager.addListener(modelListener);
        refreshButton.addActionListener(refreshAction);
        add(textComponent);
        add(refreshButton);
    }

    public void dispose() {
        modelManager.removeListener(modelListener);
        refreshButton.removeActionListener(refreshAction);
    }

    private void recalculate() {
        int count = modelManager.getActiveOntology().getClassesInSignature().size();
        if (count == 0) {
            count = 1;
        }
        textComponent.setText("Total classes = " + count);
    }
}
