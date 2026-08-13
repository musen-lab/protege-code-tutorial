# Minimal ViewComponent plugin

This is a buildable extraction of the official Protégé Plugin Examples view.
It keeps the original `ExampleViewComponent`, its `Metrics` panel, and the
corresponding `ViewComponent` declaration while removing unrelated tab and menu
examples.

## Prerequisites

- JDK 11 or later
- Maven 3.6.3 or later
- A Protégé 5.6 installation for the manual runtime check

## Build and inspect

```bash
mvn clean package
jar tf target/protege-minimal-view-1.0.0.jar
unzip -p target/protege-minimal-view-1.0.0.jar META-INF/MANIFEST.MF
unzip -p target/protege-minimal-view-1.0.0.jar plugin.xml
```

The JAR must contain `plugin.xml` at its root, the two compiled view classes,
and a generated `META-INF/MANIFEST.MF`. Confirm that the manifest includes a
singleton `Bundle-SymbolicName` and imports the Protégé packages used by the
classes.

## Run in Protégé

1. Copy `target/protege-minimal-view-1.0.0.jar` into the installation's
   `plugins/` directory, or into `~/.Protege/plugins/` for a user-local install.
2. Restart Protégé and open an ontology.
3. Choose **Window > Views > Ontology views > Example view component**.
4. Confirm that the view displays the active ontology's class count.
5. Check `~/.Protege/logs/protege.log` if the view is absent.

## Provenance

The exercise is derived from the official
[`protege-plugin-examples` snapshot](https://github.com/protegeproject/protege-plugin-examples/tree/d879601324d0c45d99e0d0879219ef15763ced50):

- Bundle POM pattern: `pom.xml:5-61`
- Complete view contribution: `src/main/resources/plugin.xml:24-31`
- View lifecycle class: `src/main/java/edu/stanford/bmir/protege/examples/view/ExampleViewComponent.java:1-25`
- Metrics panel and listener cleanup: `src/main/java/edu/stanford/bmir/protege/examples/view/Metrics.java:1-52`

The dependency and build-plugin versions are updated to currently published
Protégé 5.6 artifacts. The copied Java and XML behavior remains the behavior of
the cited official example.
