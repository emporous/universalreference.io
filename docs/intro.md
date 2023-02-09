---
sidebar_position: 1
---

# Overview

Emporous is an open-source toolkit for interacting with OCI-compliant container registries that is designed based on the concepts from the [Universal Object Reference Framework](UOR%20Framework/intro.md).

With Emporous, organizations can effortlessly store, organize and search for metadata related to software artifacts along with the artifacts themselves. 
This enables organizations to keep important information, such as trustworthiness, compliance and operational instructions, as metadata and implement policies and procedures based on it. The ability to search for attributes within the metadata makes it possible for organizations to quickly locate software artifacts, ensuring their security and compliance without manual inspection.

## Our Vision

Through the power of metadata, we hope to enable organizations to easily manage and secure their software assets.
We believe in technology's transformative potential and are committed to developing solutions that make it simple for organizations to maintain trust, compliance, and efficiency in their software operations.

## Why Emporous?

A common challenge for software ecosystems is that they are made up of numerous components, each of which requires its own set of metadata, validation mechanisms, and storage solutions. The presence of unique metadata poses a significant challenge to discoverability and validation as organizations collect, use, and share ever-increasing amounts of data. Emporous strives to provide a consistent way to develop and use shared schemas with a single validation and storage for artifacts and metadata.

Benefits:
- Provides a real-time, shared view of artifact metadata.
- Enables organizations to implement trust, compliance and runtime policies based on industry-standard schemas.
- Provides a unified method to store and manage metadata and artifacts.
- Allows organizations to easily discover software artifacts by searching for attributes within the metadata.
- Designed to be decentralized.

## Project Goals

### Standardize software artifact metadata

Support user-provided schemas.

- Normalize the use of industry-standard schemas.
- Encourage communities to develop and share schemas.
- Allow for metadata conversions.
- Integrate the system into existing container registry infrastructure and standards.

### Enhance traceability of software artifacts

Link artifacts to create metadata graphs.

- Software artifact relationships to other artifacts.
- Metadata for all artifact can be discovered and verified in the same way.

### Provide a decentralized storage option
    
Allow artifact metadata to be consumed and retrieved deterministically over a federated network of OCI-compliant registries.

- Create a smart proxy system for container registries that allows metadata to be stored alongside software artifacts.
- Implement the ability for the software artifact to self-describe using the stored metadata.

### Backward Compatibility

Support existing ecosystems.

- Store metadata for existing artifacts
- Create tools for artifact migration

![points](./points.jpg)

