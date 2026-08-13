import type { SourceRef } from "./course";

export type TechnologyLink = {
  label: string;
  url: string;
};

export type TechnologyPrimer = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  paragraphs: string[];
  officialLinks: TechnologyLink[];
  protegeSources: SourceRef[];
};

export const technologyPrimers = {
  osgi: {
    id: "osgi",
    name: "OSGi",
    shortName: "OSGi",
    description: "The Java module and lifecycle specification behind Protégé's bundle runtime.",
    paragraphs: [
      "OSGi is a set of Java specifications for assembling an application from modules called bundles. A bundle is a JAR with manifest metadata that says which Java packages it imports and exports. An OSGi framework resolves those package contracts, gives each bundle its own classloader, and manages bundle installation, start, stop, and update lifecycles.",
      "In Protégé, OSGi is the runtime boundary, not a synonym for Maven. Maven decides what compiles and produces artifacts. OSGi decides whether the built bundles can see one another and start together. That is why code can compile successfully yet fail when the assembled application resolves its bundle imports.",
    ],
    officialLinks: [
      { label: "OSGi Core framework overview", url: "https://docs.osgi.org/specification/osgi.core/8.0.0/framework.introduction.html" },
      { label: "OSGi specifications", url: "https://docs.osgi.org/specification/" },
    ],
    protegeSources: [
      { label: "Framework creation and bundle start", path: "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", line: 97, note: "Protégé creates an OSGi framework, installs bundles by start level, and starts it." },
      { label: "Runtime bundle search paths", path: "protege-desktop/src/main/felix/conf/config.xml", line: 24, note: "The desktop distribution groups its bundles into ordered runtime levels." },
    ],
  },
  felix: {
    id: "felix",
    name: "Apache Felix",
    shortName: "Felix",
    description: "The concrete OSGi framework implementation that Protégé launches.",
    paragraphs: [
      "Apache Felix is an implementation of the OSGi framework specification. OSGi defines the contracts; Felix is the runtime engine that resolves bundles, owns their lifecycle, and supplies the framework and service registries. Think of the relationship as interface and implementation, not two competing technologies.",
      "Protégé's launcher locates an OSGi FrameworkFactory through Java's service-provider mechanism and constructs that framework without hard-coding the implementation class. The shipped distribution supplies Felix, so logs, cache settings, bundle states, and start levels often use Felix terminology.",
    ],
    officialLinks: [
      { label: "Apache Felix getting started", url: "https://felix.apache.org/documentation/getting-started.html" },
      { label: "Felix framework documentation", url: "https://felix.apache.org/documentation/subprojects/apache-felix-framework/apache-felix-framework-usage-documentation.html" },
    ],
    protegeSources: [
      { label: "FrameworkFactory discovery", path: "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", line: 67, note: "The launcher reads the standard FrameworkFactory service-provider file." },
      { label: "Framework startup", path: "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", line: 97, note: "The launcher creates, initializes, populates, and starts the selected framework." },
    ],
  },
  equinox: {
    id: "equinox",
    name: "Eclipse Equinox extension registry",
    shortName: "Equinox",
    description: "The metadata registry Protégé uses to turn plugin.xml declarations into discoverable extensions.",
    paragraphs: [
      "Eclipse Equinox is a collection of runtime components from the Eclipse project. Protégé does not use Equinox as its OSGi framework. It launches Felix, then installs selected Equinox bundles, especially the extension registry. The two names therefore describe different jobs in the same process.",
      "The extension registry reads extension points and extensions declared in plugin.xml and exposes them as IExtensionPoint, IExtension, and IConfigurationElement objects. Protégé's loaders query that registry, apply application-specific filters, then ask the contributing OSGi bundle to load the named Java class.",
    ],
    officialLinks: [
      { label: "Eclipse runtime components", url: "https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.isv/guide/runtime_components.htm" },
      { label: "Extension points and the registry", url: "https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.isv/guide/runtime_registry.htm" },
      { label: "IExtensionRegistry API", url: "https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.isv/reference/api/org/eclipse/core/runtime/IExtensionRegistry.html" },
    ],
    protegeSources: [
      { label: "Equinox bundles in the distribution", path: "protege-desktop/src/main/felix/conf/config.xml", line: 33, note: "Common and supplement start before the Equinox registry bundle and editor-core." },
      { label: "Registry service lookup", path: "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java", line: 97, note: "Protégé tracks the Equinox IExtensionRegistry as an OSGi service." },
    ],
  },
  owl: {
    id: "owl",
    name: "OWL 2 Web Ontology Language",
    shortName: "OWL",
    description: "The W3C ontology language whose classes, properties, individuals, and axioms Protégé edits.",
    paragraphs: [
      "OWL is a W3C language for describing ontologies: formal vocabularies made from classes, properties, individuals, data values, and logical axioms. An ontology is the domain model being edited, not the Java object model of the desktop application.",
      "Protégé's editor-owl module supplies the OWL-specific application layer. It presents OWL entities and axioms in Swing views, coordinates reasoning and rendering, and converts editor actions into ontology changes. The tutorial explains that code path, but it does not require a complete ontology-engineering course first.",
    ],
    officialLinks: [
      { label: "W3C OWL 2 overview", url: "https://www.w3.org/TR/owl2-overview/" },
      { label: "W3C OWL 2 primer", url: "https://www.w3.org/TR/owl2-primer/" },
    ],
    protegeSources: [
      { label: "OWL editor composition root", path: "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", line: 50, note: "OWLEditorKit assembles the model and workspace for an OWL editor window." },
      { label: "OWL model facade", path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManager.java", line: 42, note: "The model manager exposes ontology lifecycle, state, listeners, and changes to the application." },
    ],
  },
  "owl-api": {
    id: "owl-api",
    name: "OWL API",
    shortName: "OWL API",
    description: "The Java library Protégé uses to represent, load, save, query, and change OWL ontologies.",
    paragraphs: [
      "OWL API is a Java library, not the OWL language itself. It supplies Java interfaces such as OWLOntology, OWLClass, OWLAxiom, and OWLOntologyManager, plus parsers, serializers, change objects, and listener APIs.",
      "Protégé wraps those library objects in application policy. OWLModelManager is the facade used by editor code for active ontology state, dirty tracking, history, rendering, events, and change application. When reading a trace, distinguish a semantic OWL object, an OWL API Java object, and a Protégé manager or Swing component.",
    ],
    officialLinks: [
      { label: "OWL API documentation", url: "https://owlcs.github.io/owlapi/" },
      { label: "OWL API source repository", url: "https://github.com/owlcs/owlapi" },
    ],
    protegeSources: [
      { label: "OWLModelManager boundary", path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManager.java", line: 42, note: "Protégé's model facade extends the generic model contract and exposes OWL API types." },
      { label: "Ontology load through OWL API", path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", line: 99, note: "The loader obtains an OWLOntologyManager and configures IRI mapping before loading." },
    ],
  },
  "swing-edt": {
    id: "swing-edt",
    name: "Swing and the Event Dispatch Thread",
    shortName: "Swing / EDT",
    description: "Java's desktop UI toolkit and the single UI thread that coordinates most visible state.",
    paragraphs: [
      "Swing is Java's long-standing desktop user-interface toolkit. Its components are mostly not thread-safe, so event handling and visible UI updates belong on one special thread, the Event Dispatch Thread or EDT. Long operations should leave the EDT so the interface can continue processing input and repaint work.",
      "Protégé is a Swing application, so every runtime trace should mark the thread boundary. OntologyLoader demonstrates the pattern explicitly: its public entry point requires the EDT, it submits the expensive load to a worker executor, and the progress dialog keeps a visible UI surface while the result is awaited.",
    ],
    officialLinks: [
      { label: "Oracle Swing tutorial", url: "https://docs.oracle.com/javase/tutorial/uiswing/" },
      { label: "Oracle Event Dispatch Thread guide", url: "https://docs.oracle.com/javase/tutorial/uiswing/concurrency/dispatch.html" },
    ],
    protegeSources: [
      { label: "OntologyLoader thread boundary", path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", line: 57, note: "The entry point rejects calls outside the EDT and delegates the load to a worker." },
    ],
  },
  bnd: {
    id: "bnd",
    name: "bnd OSGi bundle tooling",
    shortName: "bnd",
    description: "The build tool that analyzes Java bytecode and emits OSGi manifest metadata.",
    paragraphs: [
      "bnd is OSGi bundle tooling used behind Maven, Gradle, Eclipse, and its own command line. Its central job is to analyze compiled Java classes and generate the package metadata an OSGi runtime needs. In this repository, the Apache Felix maven-bundle-plugin exposes bnd instructions inside module POMs.",
      "Maven still controls the build lifecycle and dependency graph. bnd controls what the resulting JAR says to the OSGi resolver through headers such as Import-Package, Export-Package, Bundle-SymbolicName, and Bundle-Activator. Always inspect the generated META-INF/MANIFEST.MF because it is the runtime contract actually shipped.",
    ],
    officialLinks: [
      { label: "bnd documentation", url: "https://bnd.bndtools.org/" },
      { label: "bnd concepts", url: "https://bnd.bndtools.org/chapters/110-introduction.html" },
    ],
    protegeSources: [
      { label: "editor-core bundle instructions", path: "protege-editor-core/pom.xml", line: 84, note: "The module configures maven-bundle-plugin and its generated OSGi headers." },
    ],
  },
  "eclipse-ide": {
    id: "eclipse-ide",
    name: "Eclipse PDE and m2e",
    shortName: "PDE / m2e",
    description: "Eclipse tooling used by Protégé's IDE profile to launch and debug an OSGi workspace.",
    paragraphs: [
      "PDE is Eclipse's Plug-in Development Environment for developing and launching OSGi-based Eclipse plug-ins. m2e integrates Maven project configuration into Eclipse. They are development tools, not parts of the Protégé runtime learners must install merely to read or build the course.",
      "Protégé's ide Maven profile prepares module projects for this workflow. It writes manifests where PDE expects them, copies provided dependencies, and exposes plugin.xml at the project root. The profile prepares an IDE launch; it does not itself start Protégé.",
    ],
    officialLinks: [
      { label: "Eclipse PDE", url: "https://www.eclipse.org/pde/" },
      { label: "Eclipse m2e", url: "https://eclipse.dev/m2e/" },
    ],
    protegeSources: [
      { label: "IDE profile", path: "pom.xml", line: 565, note: "The profile prepares manifests, dependencies, and plugin.xml for PDE, m2e, and an OSGi framework launch." },
    ],
  },
  "xml-stack": {
    id: "xml-stack",
    name: "SAX and JAXB XML support",
    shortName: "SAX / JAXB",
    description: "The XML parsing and binding services that must be available before registry metadata is read.",
    paragraphs: [
      "SAX is Java's event-driven XML parsing API. JAXB maps XML documents to and from Java objects. They solve different XML problems, and neither is Protégé's plugin system. They appear early because extension declarations and other configuration must be parsed before the editor can be assembled.",
      "Protégé starts protege-common first so it can register SAXParserFactory as an OSGi service. The desktop configuration then starts Equinox support and a Protégé JAXB compatibility bundle before editor-core. This ordering is runtime infrastructure, not a recommended layer structure for feature code.",
    ],
    officialLinks: [
      { label: "Java SE 11 SAX API", url: "https://docs.oracle.com/en/java/javase/11/docs/api/java.xml/org/xml/sax/package-summary.html" },
      { label: "Jakarta XML Binding specification", url: "https://jakarta.ee/specifications/xml-binding/" },
    ],
    protegeSources: [
      { label: "Early XML service", path: "protege-common/src/main/java/org/protege/common/Activator.java", line: 16, note: "The common activator registers SAXParserFactory when its bundle starts." },
      { label: "XML-related start order", path: "protege-desktop/src/main/felix/conf/config.xml", line: 18, note: "The configuration documents the required order and starts the JAXB compatibility bundle." },
    ],
  },
} satisfies Record<string, TechnologyPrimer>;

export type TechnologyPrimerId = keyof typeof technologyPrimers;

export const technologyPrimerList = Object.values(technologyPrimers);
