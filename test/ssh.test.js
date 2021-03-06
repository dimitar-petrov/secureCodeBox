const { startSecurityTest, Time } = require('./sdk');

test(
  'finds a few medium severity findings for ssh-service',
  async () => {
    const securityTest = await startSecurityTest({
      context: 'ssh-service ssh',
      metaData: {},
      name: 'ssh',
      target: {
        name: 'ssh-service ssh',
        location: 'ssh-service',
        attributes: {},
      },
    });

    const { report } = securityTest;

    const findings = report.findings.map(
      ({ description, category, name, osi_layer, severity }) => ({
        description,
        category,
        name,
        osi_layer,
        severity,
      })
    );

    expect(findings).toContainEqual({
      category: 'SSH Service',
      name: 'SSH Service Information',
      osi_layer: 'NETWORK',
      severity: 'INFORMATIONAL',
    });

    expect(findings).toContainEqual({
      description: 'Deprecated / discouraged SSH key algorithms are used',
      category: 'SSH Policy Violation',
      name: 'Insecure SSH Key Algorithms',
      osi_layer: 'NETWORK',
      severity: 'MEDIUM',
    });

    expect(findings).toContainEqual({
      description: 'Deprecated / discouraged SSH MAC algorithms are used',
      category: 'SSH Policy Violation',
      name: 'Insecure SSH MAC Algorithms',
      osi_layer: 'NETWORK',
      severity: 'MEDIUM',
    });

    expect(findings).toContainEqual({
      description: 'Discouraged SSH authentication methods are used',
      category: 'SSH Policy Violation',
      name: 'Discouraged SSH authentication methods',
      osi_layer: 'NETWORK',
      severity: 'MEDIUM',
    });

    expect(
      findings
        .filter(({ name }) => name !== 'SSH Service Information')
        .filter(({ name }) => name !== 'Insecure SSH Key Algorithms')
        .filter(({ name }) => name !== 'Insecure SSH MAC Algorithms')
        .filter(({ name }) => name !== 'Discouraged SSH authentication methods')
    ).toEqual([]);
  },
  2 * Time.Minute
);
